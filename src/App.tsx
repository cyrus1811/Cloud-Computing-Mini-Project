import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Trash2, Plus, LogOut, CheckCircle } from "lucide-react";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const { signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    if (newTodoContent.trim()) {
      client.models.Todo.create({ content: newTodoContent });
      setNewTodoContent("");
    }
  }
    
  function deleteTodo(id: string, e) {
    e.stopPropagation();
    client.models.Todo.delete({ id });
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      createTodo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">My Tasks</h1>
          <button 
            onClick={signOut}
            className="text-indigo-100 hover:text-white flex items-center gap-1 text-sm"
          >
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
        
        {/* Add Todo Input */}
        <div className="p-4 border-b">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodoContent}
              onChange={(e) => setNewTodoContent(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={createTodo}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 flex items-center gap-1 hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
        
        {/* Todo List */}
        <div className="p-4 overflow-y-auto max-h-96">
          {todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle size={48} className="mx-auto mb-2 text-gray-300" />
              <p>No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 flex justify-between items-center group transition-colors"
                >
                  <span className="text-gray-800">{todo.content}</span>
                  <button
                    onClick={(e) => deleteTodo(todo.id, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 text-center">
          🎉 App successfully hosted. You have {todos.length} task{todos.length !== 1 ? 's' : ''}.
        </div>
      </div>
    </div>
  );
}

export default App;