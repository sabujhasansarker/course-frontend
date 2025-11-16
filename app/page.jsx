import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("courses").select();
  console.log(todos);

  return (
    <ul>
      {todos.map((data, i) => (
        <li key={data.id}>
          <h2>{data.instructor}</h2>
        </li>
      ))}
    </ul>
  );
}
