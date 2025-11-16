// app/page.tsx
import { prisma } from "@/lib/prisma";
import { Course } from "@/types/course";

export default async function Page() {
  const courses: Course[] = await prisma.course.findMany();

  return (
    <div className="courses">
      <h1 className="text-center">Courses</h1>
      <ul>
        {courses?.map((course) => (
          <li key={course.id} className="mb-30">
            <h2>Course name:{course.name}</h2>
            <p>Instructor: {course.instructor}</p>
            <p>Duration: {course.duration} hours</p>
            {course.website && (
              <a
                href={course.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Course
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
