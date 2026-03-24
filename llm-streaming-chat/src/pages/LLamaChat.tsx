import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const useSmoothStream = (speed = 30) => {
    const [visibleText, setVisibleText] = useState('');
    const fullTextRef = useRef('');
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const appendText = useCallback((chunk: string) => {
        fullTextRef.current += chunk;

        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setVisibleText(prev => {
                    const next = fullTextRef.current.slice(0, prev.length + 1);
                    if (next === fullTextRef.current) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                    }
                    return next;
                });
            }, speed);
        }
    }, [speed]);

    const reset = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        fullTextRef.current = '';
        setVisibleText('');
    }, []);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return { visibleText, appendText, reset };
};

const LlamaChat: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { visibleText, appendText, reset } = useSmoothStream();

    const handleSubmit = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        reset();

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const res = await fetch(`${baseUrl}/llama/chat?q=${encodeURIComponent(query)}`);

            if (!res.ok) {
                throw new Error('Failed to get response');
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    appendText(chunk);
                }
            }
        } catch (err) {
            setError('Failed to get response. Make sure Ollama is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            handleSubmit();
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Llama Chat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="query">Ask a question</Label>
                        <Input
                            id="query"
                            type="text"
                            placeholder="Type your question..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!query.trim() || loading}
                        className="w-full"
                    >
                        {loading ? 'Generating...' : 'Send'}
                    </Button>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {visibleText && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-600 font-medium mb-2">Response:</p>
                            <p className="text-gray-800 whitespace-pre-wrap">{visibleText}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default LlamaChat;
