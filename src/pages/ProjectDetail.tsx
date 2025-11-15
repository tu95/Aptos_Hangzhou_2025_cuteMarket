import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { PROJECTS } from '../data/projects';
import { getProjectStatus, getStatusText, getStatusColor } from '../utils/dateUtils';
import { ProjectStatus } from '../types';
import { aptos, MODULE_ADDRESS, MODULE_NAME } from '../config/aptos';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, connected, signAndSubmitTransaction } = useWallet();
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const project = PROJECTS.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/95 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">项目未找到</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const status = getProjectStatus(project);
  const statusText = getStatusText(status);
  const statusColor = getStatusColor(status);
  const isClosed = status !== ProjectStatus.Open;

  const handleBet = async () => {
    if (!connected) {
      setMessage({ type: 'error', text: '请先连接钱包' });
      return;
    }

    if (selectedOption === null) {
      setMessage({ type: 'error', text: '请选择一个投注选项' });
      return;
    }

    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount < 1) {
      setMessage({ type: 'error', text: '投注金额至少为 1 APT' });
      return;
    }

    if (isClosed) {
      setMessage({ type: 'error', text: '该项目已关闭，无法下注' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // 将 APT 转换为 Octas（1 APT = 100000000 Octas）
      const amountInOctas = Math.floor(amount * 100000000);

      const payload = {
        type: 'entry_function_payload',
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::place_bet`,
        type_arguments: [],
        arguments: [project.id, selectedOption, amountInOctas],
      };

      const response = await signAndSubmitTransaction(payload);
      
      // 等待交易确认
      await aptos.waitForTransaction({ transactionHash: response.hash });

      setMessage({
        type: 'success',
        text: `下注成功！已在选项 "${project.options[selectedOption]}" 上投注 ${amount} APT`,
      });
      
      // 重置表单
      setSelectedOption(null);
      setBetAmount('1');
    } catch (error: any) {
      console.error('下注失败:', error);
      setMessage({
        type: 'error',
        text: error.message || '下注失败，请重试',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-white hover:text-white/80 flex items-center gap-2"
      >
        ← 返回首页
      </button>

      <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg overflow-hidden">
        {/* 项目头部 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold">{project.name}</h1>
            <span className={`${statusColor} px-4 py-2 rounded-full text-sm font-semibold`}>
              {statusText}
            </span>
          </div>
          {project.description && (
            <p className="text-white/90 text-lg">{project.description}</p>
          )}
          <p className="text-white/80 mt-4">
            截止日期: <span className="font-semibold">{project.endDate}</span>
          </p>
        </div>

        {/* 项目内容 */}
        <div className="p-8">
          {isClosed && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
              <p className="font-bold">已截止，等待开奖</p>
              <p className="text-sm">该项目已过结束时间，不能继续下注</p>
            </div>
          )}

          {message && (
            <div
              className={`${
                message.type === 'success'
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-red-100 border-red-500 text-red-700'
              } border-l-4 p-4 mb-6`}
            >
              <p>{message.text}</p>
            </div>
          )}

          {/* 投注选项 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">选择投注选项</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !isClosed && setSelectedOption(index)}
                  disabled={isClosed}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedOption === index
                      ? 'border-purple-600 bg-purple-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-purple-400 hover:shadow-md'
                  } ${isClosed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{option}</h3>
                    <p className="text-sm text-gray-500">当前投注额</p>
                    <p className="text-2xl font-bold text-purple-600">0 APT</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 下注表单 */}
          {!isClosed && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">投注金额</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    输入金额 (APT)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="最少 1 APT"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleBet}
                    disabled={isSubmitting || !connected || selectedOption === null}
                    className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
                      isSubmitting || !connected || selectedOption === null
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting
                      ? '提交中...'
                      : !connected
                      ? '请连接钱包'
                      : selectedOption === null
                      ? '请选择选项'
                      : `下注 ${betAmount} APT`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 总投注池 */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">项目统计</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">总投注额</p>
                <p className="text-2xl font-bold text-purple-600">0 APT</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">投注选项</p>
                <p className="text-2xl font-bold text-blue-600">{project.options.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">参与人数</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

