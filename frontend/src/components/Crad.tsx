import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  description?: string;
  navigateTo: string;
}

export default function Card({ title, description, navigateTo }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 ring-1 ring-slate-200/70 w-full max-w-sm">
      <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
      <div className="mt-4">
        <Link
          to={navigateTo}
          className="inline-flex items-center justify-center rounded-md text-white text-yellow-400 px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
