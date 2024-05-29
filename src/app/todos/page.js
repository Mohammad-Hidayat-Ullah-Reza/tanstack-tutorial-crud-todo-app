"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosConfig from "../../../axiosConfig";
import React from "react";

const TodosPage = () => {
  const queryClient = useQueryClient();
  // post the data
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axiosConfig.post("/todos", newTodo);
    },
    onMutate: (variables) => {
      console.log("A mutation is about to happen");
    },
    onError: (error, variables, context) => {
      console.log("Error", error.message);
    },
    onSuccess: (data, variables, context) => {
      console.log("Success", data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  //  fetch the data
  const { data: todosData } = useQuery({
    queryKey: ["todos"],
    queryFn: () => axiosConfig.get("/todos"),
  });
  return (
    <div>
      {mutation.isPending ? (
        "Adding todo..."
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: "Doing Laundry" });
            }}
          >
            Create Todo
          </button>
          <ol className="list-decimal list-inside">
            {todosData?.data?.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
};

export default TodosPage;
