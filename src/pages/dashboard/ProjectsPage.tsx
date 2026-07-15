import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import ProjectCard from "../../components/projects/ProjectCard";
import { mockProjects } from "../../data/mockProjects";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [club, setClub] = useState("All");

  const clubs = useMemo(
    () => ["All", ...new Set(mockProjects.map((p) => p.club))],
    []
  );

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase());

      const matchesClub =
        club === "All" || project.club === club;

      return matchesSearch && matchesClub;
    });
  }, [search, club]);

  const featuredProjects = filteredProjects.filter(
    (project) => project.featured
  );

  return (
    <div className="mx-auto max-w-7xl space-y-10 p-6">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          🚀 Club Projects
        </h1>

        <p className="mt-2 text-gray-600">
          Discover projects created by CampusOS clubs.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-4 md:flex-row">

        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-3.5 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500"
          />
        </div>

        <select
          value={club}
          onChange={(e) => setClub(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
        >
          {clubs.map((club) => (
            <option key={club} value={club}>
              {club}
            </option>
          ))}
        </select>

      </div>

      {/* Featured */}
      {featuredProjects.length > 0 && (
        <section>

          <h2 className="mb-5 text-2xl font-bold">
            ⭐ Featured Projects
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>

        </section>
      )}

      {/* All Projects */}
      <section>

        <h2 className="mb-5 text-2xl font-bold">
          📂 All Projects
        </h2>

        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <h3 className="text-xl font-semibold">
              No projects found
            </h3>

            <p className="mt-2 text-gray-500">
              Try another search or filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}

      </section>

    </div>
  );
}