import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <main className="min-h-screen bg-gray-100 w-screen">
        <Navbar />
        <div className="p-4 flex-1">
          <div className="min-h-screen bg-gray-50 px-8 pt-20 py-12">
          {children}
          </div>
          </div>
      </main>
  );
}
