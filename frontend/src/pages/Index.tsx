
import Chat from "@/components/Chat";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      <Header />
      <main className="flex-1">
        <Chat />
      </main>
      <footer className="text-center py-4 text-white/70 text-sm">
        © {new Date().getFullYear()} AI Chat Assistant • Powered by React
      </footer>
    </div>
  );
};

export default Index;
