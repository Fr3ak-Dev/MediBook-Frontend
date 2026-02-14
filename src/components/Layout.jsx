import Navbar from './Navbar';

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="w-full md:container mx-auto px-3 md:px-4 py-4 md:py-8">
                {children}
            </main>
        </div>
    )
}

export default Layout;