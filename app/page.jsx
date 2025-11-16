import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const { data: todos } = await supabase.from("courses").select();
  console.log(todos);

  return (
    <ul>
      {todos?.map((data, i) => (
        <li key={data.id}>
          <h2>{data.instructor}</h2>
        </li>
      ))}
    </ul>
  );
}
