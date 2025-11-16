// app/page.tsx
import { prisma } from "@/lib/prisma";
import { Course } from "@/types/course";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Add Course
async function addCourse(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const instructor = formData.get("instructor") as string;
  const duration = Number(formData.get("duration"));
  const website = formData.get("website") as string;

  try {
    await prisma.course.create({
      data: {
        name,
        instructor,
        duration,
        website: website || null,
      },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error adding course:", error);
  }
}

// Delete Course
async function deleteCourse(formData: FormData) {
  "use server";

  const courseId = Number(formData.get("courseId"));
  const confirm = formData.get("confirm") as string;

  if (confirm !== "true") {
    return;
  }

  try {
    await prisma.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting course:", error);
  }
}

// Edit Course
async function editCourse(formData: FormData) {
  "use server";

  const courseId = Number(formData.get("courseId"));
  const name = formData.get("name") as string;
  const instructor = formData.get("instructor") as string;
  const duration = Number(formData.get("duration"));
  const website = formData.get("website") as string;

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        name,
        instructor,
        duration,
        website: website || null,
      },
    });

    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.error("Error editing course:", error);
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: { edit?: string; view?: string };
}) {
  const courses: Course[] = await prisma.course.findMany();

  // Find by ID for editing
  const editId = searchParams.edit ? Number(searchParams.edit) : null;
  const editCourse = editId
    ? await prisma.course.findUnique({ where: { id: editId } })
    : null;

  // Find by ID for viewing
  const viewId = searchParams.view ? Number(searchParams.view) : null;
  const viewCourse = viewId
    ? await prisma.course.findUnique({ where: { id: viewId } })
    : null;

  return (
    <div className="courses py-[100px] max-w-4xl mx-auto px-4">
      <h1 className="text-center mb-[60px] text-[40px] font-[700]">Courses</h1>

      {/* Add Course Form */}
      <div className="mb-[60px] border p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
        <form action={addCourse} className="space-y-4">
          <div>
            <label className="block mb-1">Course Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Instructor</label>
            <input
              type="text"
              name="instructor"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Duration (hours)</label>
            <input
              type="number"
              step="0.1"
              name="duration"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Website (optional)</label>
            <input
              type="url"
              name="website"
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Add Course
          </button>
        </form>
      </div>

      {/* Edit Course Form */}
      {editCourse && (
        <div className="mb-[60px] border p-6 rounded bg-yellow-50">
          <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
          <form action={editCourse} className="space-y-4">
            <input type="hidden" name="courseId" value={editCourse.id} />
            <div>
              <label className="block mb-1">Course Name</label>
              <input
                type="text"
                name="name"
                defaultValue={editCourse.name}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Instructor</label>
              <input
                type="text"
                name="instructor"
                defaultValue={editCourse.instructor}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Duration (hours)</label>
              <input
                type="number"
                step="0.1"
                name="duration"
                defaultValue={editCourse.duration}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Website (optional)</label>
              <input
                type="url"
                name="website"
                defaultValue={editCourse.website || ""}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Update Course
              </button>
              <a
                href="/"
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 inline-block"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      )}

      {/* View Single Course */}
      {viewCourse && (
        <div className="mb-[60px] border p-6 rounded bg-blue-50">
          <h2 className="text-2xl font-bold mb-4">Course Details</h2>
          <p>
            <strong>ID:</strong> {viewCourse.id}
          </p>
          <p>
            <strong>Name:</strong> {viewCourse.name}
          </p>
          <p>
            <strong>Instructor:</strong> {viewCourse.instructor}
          </p>
          <p>
            <strong>Duration:</strong> {viewCourse.duration} hours
          </p>
          {viewCourse.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={viewCourse.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {viewCourse.website}
              </a>
            </p>
          )}
          <a
            href="/"
            className="inline-block mt-4 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </a>
        </div>
      )}

      {/* List All Courses */}
      <h2 className="text-2xl font-bold mb-4">All Courses</h2>
      <ul className="space-y-4">
        {courses?.map((course) => (
          <li key={course.id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">Course name: {course.name}</h3>
            <p>Instructor: {course.instructor}</p>
            <p>Duration: {course.duration} hours</p>
            {course.website && (
              <a
                className="block text-blue-600 hover:underline"
                href={course.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Course
              </a>
            )}
            <div className="flex gap-2 mt-3">
              <a
                href={`?view=${course.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View
              </a>
              <a
                href={`?edit=${course.id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </a>
              <form action={deleteCourse}>
                <input type="hidden" name="courseId" value={course.id} />
                <input type="hidden" name="confirm" value="true" />
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  formAction={async (formData) => {
                    "use server";
                    const courseId = Number(formData.get("courseId"));
                    const courseName = course.name;

                    // Note: Server-side confirmation isn't ideal, better to use client component
                    await prisma.course.delete({
                      where: { id: courseId },
                    });
                    revalidatePath("/");
                  }}
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
