import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Send, X, Bot, Loader2 } from "lucide-react";
import { aiService } from "@/lib/ai-service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function GreenOracleChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
        { role: 'bot', content: "Hello! I'm GreenOracle. You can ask me about Nigeria's politics, budget, environmental issues, or how to use this app." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const answer = await aiService.askGreenOracle(userMessage);
            setMessages(prev => [...prev, { role: 'bot', content: answer }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 animate-in zoom-in duration-300"
                >
                    <Bot className="h-8 w-8 text-white" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-[350px] shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 border-green-200">
                    <CardHeader className="flex flex-row items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-green-600" />
                            <CardTitle className="text-base font-bold text-green-800 dark:text-green-300">GreenOracle AI</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="p-0">
                        <ScrollArea className="h-[400px] p-4">
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex w-full mb-2",
                                            msg.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                                msg.role === 'user'
                                                    ? "bg-green-600 text-white rounded-br-none"
                                                    : "bg-muted text-foreground rounded-bl-none"
                                            )}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start w-full">
                                        <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 bg-muted/20">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex w-full items-center gap-2"
                        >
                            <Input
                                placeholder="Ask about environment..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 focus-visible:ring-green-500"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-10 w-10 bg-green-600 hover:bg-green-700">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
