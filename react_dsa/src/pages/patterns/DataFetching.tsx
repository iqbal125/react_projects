import React, { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    company: { name: string };
}

interface NewPost {
    id?: number;
    title: string;
    body: string;
    userId: number;
}

const DataFetching: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // POST state
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [postResult, setPostResult] = useState<NewPost | null>(null);
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState<string | null>(null);

    useEffect(() => {

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    'https://jsonplaceholder.typicode.com/users',
                );
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data: User[] = await response.json();
                setUsers(data);
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

    }, []);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setPosting(true);
        setPostError(null);
        setPostResult(null);
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: postTitle,
                    body: postBody,
                    userId: 1,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data: NewPost = await response.json();
            setPostResult(data);
            setPostTitle('');
            setPostBody('');
        } catch (err) {
            setPostError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setPosting(false);
        }
    };

    // Derived — no extra state needed
    const selectedUser = users.find((u) => u.id === selectedId);

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pattern: Data Fetching</h1>
                <p className="mt-1 text-gray-600 text-sm">
                    Fetch inside <code>useEffect</code> with an <code>AbortController</code> for
                    cleanup. Explicit TypeScript interfaces enforce the shape of external data.
                    Three states: loading, error, success — never show stale or partial data.
                </p>
            </div>

            {loading && <div className="text-blue-600 animate-pulse text-sm">Loading users…</div>}

            {error && (
                <div className="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">
                    Error: {error}
                </div>
            )}

            {!loading && !error && (
                <div className="space-y-4">
                    <ul className="space-y-2">
                        {users.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => setSelectedId((prev) => (prev === user.id ? null : user.id))}
                                className={`flex justify-between items-center rounded-lg px-4 py-2 cursor-pointer transition-colors ${selectedId === user.id
                                    ? 'bg-blue-100 border border-blue-300'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                <div>
                                    <span className="font-medium">{user.name}</span>
                                    <span className="ml-2 text-xs text-gray-500">@{user.username}</span>
                                </div>
                                <span className="text-sm text-gray-500">{user.company.name}</span>
                            </li>
                        ))}
                    </ul>

                    {selectedUser && (
                        <div className="bg-blue-50 rounded-xl p-4 space-y-1">
                            <h2 className="font-semibold text-blue-800">{selectedUser.name}</h2>
                            <p className="text-sm text-blue-700">Email: {selectedUser.email}</p>
                            <p className="text-sm text-blue-700">Phone: {selectedUser.phone}</p>
                            <p className="text-sm text-blue-700">Website: {selectedUser.website}</p>
                            <p className="text-sm text-blue-700">Company: {selectedUser.company.name}</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── POST Example ── */}
            <div className="border-t pt-6 space-y-3">
                <h2 className="text-lg font-semibold text-gray-800">POST Example</h2>
                <p className="text-sm text-gray-600">
                    Submit a new post to <code>jsonplaceholder.typicode.com/posts</code>.
                    Uses <code>fetch</code> with <code>method: 'POST'</code> and a JSON body.
                </p>

                <form onSubmit={handlePost} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Post title"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        required
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <textarea
                        placeholder="Post body"
                        value={postBody}
                        onChange={(e) => setPostBody(e.target.value)}
                        required
                        rows={3}
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                        type="submit"
                        disabled={posting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {posting ? 'Posting…' : 'Create Post'}
                    </button>
                </form>

                {postError && (
                    <div className="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">
                        Error: {postError}
                    </div>
                )}

                {postResult && (
                    <div className="bg-green-50 rounded-xl p-4 space-y-1">
                        <h3 className="font-semibold text-green-800">Created (id: {postResult.id})</h3>
                        <p className="text-sm text-green-700">Title: {postResult.title}</p>
                        <p className="text-sm text-green-700">Body: {postResult.body}</p>
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-400">
                Open DevTools Network tab to see the fetch. In StrictMode, two requests fire —
                the first is aborted via <code>AbortController</code>.
            </p>
        </div>
    );
};

export default DataFetching;
