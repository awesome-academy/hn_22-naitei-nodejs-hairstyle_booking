import React, { useState, useCallback } from "react";
import NavBar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import ServiceCard from "../components/service/ServiceCard";
import SearchBar from "../components/common/SearchBar";
import ServiceFilters from "../components/service/ServiceFilters";
import Pagination from "../components/common/Pagination";
import { useServices } from "../hooks/useServices";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    maxDuration: "",
    page: 1,
    limit: 12,
  });

  const { services, loading, error, pagination, fetchServices } =
    useServices(filters);

  const navigate = useNavigate();

  const handleSearch = useCallback(
    (searchTerm) => {
      const newFilters = {
        ...filters,
        search: searchTerm,
        page: 1,
      };
      setFilters(newFilters);
      fetchServices(newFilters);
    },
    [filters, fetchServices]
  );

  const handleFiltersChange = useCallback(
    (newFilters) => {
      const updatedFilters = {
        ...newFilters,
        page: 1,
      };
      setFilters(updatedFilters);
      fetchServices(updatedFilters);
    },
    [filters, fetchServices]
  );

  const handlePageChange = useCallback(
    (page) => {
      const newFilters = { ...filters, page };
      setFilters(newFilters);
      fetchServices(newFilters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filters, fetchServices]
  );

  const handleBookService = useCallback(
    (serviceId) => {
      navigate(`/booking?serviceIds=${serviceId}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Hair Services
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover professional hair services from cutting and styling to
            coloring and treatments
          </p>
        </div>
      </section>

      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search services by name or description..."
          />
          <ServiceFilters onFiltersChange={handleFiltersChange} />

          <div className="mt-4 text-gray-600">
            {filters.search ? (
              <p>
                Found {pagination.totalItems} services for &quot;
                {filters.search}&quot;
              </p>
            ) : (
              <p>Showing {pagination.totalItems} services</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
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
                onClick={() => fetchServices(filters)}
                className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Try Again
              </button>
            </div>
          ) : services.length === 0 ? (
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
              <p className="text-gray-600">No services found</p>
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
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBookService={handleBookService} // ✅ Pass callback with serviceId
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

export default Services;
