import { Link } from 'react-router-dom';
import { Project } from '../types';
import { getProjectStatus, getStatusText, getStatusColor } from '../utils/dateUtils';
import { useProjectData } from '../hooks/useProjectData';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = getProjectStatus(project);
  const statusText = getStatusText(status);
  const statusColor = getStatusColor(status);
  const { data, loading } = useProjectData(project.id);

  return (
    <Link
      to={`/project/${project.id}`}
      className="block bg-white/95 backdrop-blur rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
    >
      <div className="p-6">
        {/* 标题和状态 */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{project.name}</h3>
          <span
            className={`${statusColor} text-white text-xs px-3 py-1 rounded-full font-semibold`}
          >
            {data?.isSettled ? '已开奖' : statusText}
          </span>
        </div>

        {/* 描述 */}
        {project.description && (
          <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
        )}

        {/* 选项 */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">投注选项：</p>
          <div className="flex flex-wrap gap-2">
            {project.options.map((option, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data?.isSettled && data.winningOption === index
                    ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {option}
                {data?.isSettled && data.winningOption === index && ' 🏆'}
              </span>
            ))}
          </div>
        </div>

        {/* 投注池 */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            总投注额:{' '}
            <span className="font-bold text-purple-600">
              {loading ? '加载中...' : `${data?.totalPool.toFixed(2) || 0} APT`}
            </span>
          </p>
        </div>

        {/* 结束时间 */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            截止日期: <span className="font-semibold text-gray-700">{project.endDate}</span>
          </p>
          <span className="text-purple-600 font-semibold hover:text-purple-700">
            查看详情 →
          </span>
        </div>
      </div>
    </Link>
  );
}

