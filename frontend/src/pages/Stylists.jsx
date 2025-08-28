import React, { useState, useCallback, useEffect } from "react";
import NavBar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import StylistCard from "../components/stylist/StylistCard";
import SearchBar from "../components/common/SearchBar";
import StylistFilters from "../components/stylist/StylistFilters";
import Pagination from "../components/common/Pagination";
import { useStylists } from "../hooks/useStylists";

const Stylists = () => {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    limit: 12,
  });

  const { stylists, loading, error, pagination, fetchStylists, toggleFavourite } = useStylists();

  useEffect(() => {
    fetchStylists(filters);
  }, []);

  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    fetchStylists(filters);
  }, [filters]);

  const handleSearch = useCallback((searchTerm) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleViewStylist = useCallback((stylist) => {
    console.log("Viewing stylist:", stylist);
  }, []);

  const handleBookStylist = useCallback((stylist) => {
    console.log("Booking stylist:", stylist);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Stylist
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect with talented hair stylists who will help you achieve your
            dream look
          </p>
        </div>
      </section>

      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search stylists by name..."
          />

          <StylistFilters onFiltersChange={handleFiltersChange} />

          <div className="mt-4 text-gray-600">
            {filters.search ? (
              <p>
                Found {pagination.totalItems} stylists for &quot;{filters.search}&quot;
              </p>
            ) : (
              <p>Showing {pagination.totalItems} stylists</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-gray-600">Loading stylists...</p>
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
                onClick={() => fetchStylists(filters)}
                className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Try Again
              </button>
            </div>
          ) : stylists.length === 0 ? (
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">No stylists found</p>
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
                {stylists.map((stylist) => (
                  <StylistCard
                    key={stylist.id}
                    stylist={stylist}
                    onViewStylist={handleViewStylist}
                    onBookStylist={handleBookStylist}
                    onToggleFavourite={toggleFavourite}
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

export default Stylists;
