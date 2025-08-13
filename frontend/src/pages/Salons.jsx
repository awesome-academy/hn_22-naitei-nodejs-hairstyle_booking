import React, { useState, useCallback, useEffect } from "react";
import NavBar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import SalonCard from "../components/salon/SalonCard";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import { useSalons } from "../hooks/useSalons";

const Salons = () => {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 12,
  });

  const { salons, loading, error, pagination, fetchSalons } = useSalons();

  // Initial load
  useEffect(() => {
    fetchSalons(filters);
  }, []); // Chỉ chạy lần đầu

  // Re-fetch khi filters thay đổi (nhưng skip initial render)
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return; // Skip initial render
    }

    fetchSalons(filters);
  }, [filters]); // Dependency là filters object

  const handleSearch = useCallback((searchTerm) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleViewSalon = useCallback((salon) => {
    console.log("Viewing salon:", salon);
    // Navigate to salon detail page or open modal
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Salon
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover the best hair salons in your area with professional
            stylists and premium services
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search salons by name or address..."
          />

          <div className="mt-4 text-gray-600">
            {filters.search ? (
              <p>
                Found {pagination.totalItems} salons for &quot;{filters.search}
                &quot;
              </p>
            ) : (
              <p>Showing {pagination.totalItems} salons</p>
            )}
          </div>
        </div>
      </section>

      {/* Salons Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-gray-600">Loading salons...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => fetchSalons(filters)}
                className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Try Again
              </button>
            </div>
          ) : salons.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-5a2 2 0 00-2-2H8a2 2 0 00-2 2v5m5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5"
                  />
                </svg>
              </div>
              <p className="text-gray-600">No salons found</p>
              {filters.search && (
                <button
                  onClick={() => handleSearch("")}
                  className="mt-4 text-pink-500 hover:text-pink-700 transition"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {salons.map((salon) => (
                  <SalonCard
                    key={salon.id}
                    salon={salon}
                    onViewSalon={handleViewSalon}
                  />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Salons;
