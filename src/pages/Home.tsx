import { PROJECTS } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';

export function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">预测市场</h2>
        <p className="text-white/80 text-lg">
          选择一个项目，预测未来，赢取奖励
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

