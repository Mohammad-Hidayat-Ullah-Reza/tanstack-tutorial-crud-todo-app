"use client";
import { useIsFetching, useQuery } from "@tanstack/react-query";

export default function Home() {
  const ifFetching = useIsFetching();
  // fetching todos data
  const {
    data: todosData,
    isLoading: isTodosLoading,
    isError: isTodosError,
    isSuccess: isTodosSuccess,
  } = useQuery({
    // for caching the data
    queryKey: ["todos"],
    // fetching the data
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/todos").then((res) =>
        res.json()
      ),
    // filtering the data
    select: (todos) =>
      todos.map((todo) => ({ id: todo.id, title: todo.title })),
  });

  // fetching users data
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
        res.json()
      ),
    enabled: !!todosData,
  });

  // checking if todos data is loading
  // if (isTodosLoading) {
  //   return (
  //     <div className="h-[100vh] w-full flex items-center justify-center text-6xl font-bold">
  //       The data is Loading...
  //     </div>
  //   );
  // }

  return (
    <main className="min-h-screen grid grid-cols-2 gap-4 p-24 bg-black text-white">
      {/* show the loading data for todos */}
      {isTodosLoading && (
        <div className="h-[100vh] bg-black text-white w-full flex items-center justify-center text-3xl font-bold">
          The data is Loading...
        </div>
      )}
      {/* the loaded todo list data */}
      <div className="pl-4 border-l-2 border-gray-300">
        <h1 className="text-3xl font-bold text-center uppercase mb-3">Todos</h1>
        <ul className="flex flex-col gap-2">
          {todosData?.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      </div>
      <div className="pl-4 border-l-2 border-gray-300">
        <h1 className="text-3xl font-bold text-center uppercase mb-3">Users</h1>
        <ul className="flex flex-col gap-2">
          {usersData?.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
