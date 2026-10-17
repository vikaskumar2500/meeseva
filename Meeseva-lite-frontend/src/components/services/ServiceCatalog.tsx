import React, { useState, useEffect } from 'react';
import { Search, Mic, Star, Clock, IndianRupee, ArrowRight, ShieldCheck } from 'lucide-react';
import type { GovService } from '../../types/index.js';
import { api } from '../../services/api.js';

interface ServiceCatalogProps {
  onSelectService: (service: GovService) => void;
  onOpenVoiceAssistant: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  onSelectService,
  onOpenVoiceAssistant,
  searchQuery,
  setSearchQuery,
}) => {
  const [services, setServices] = useState<GovService[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServicesAndCategories();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      handleSearch(searchQuery);
    } else if (searchQuery.trim().length === 0) {
      fetchServicesAndCategories();
    }
  }, [searchQuery]);

  const fetchServicesAndCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const servicesRes = await api.getServices({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        limit: 30,
      });
      setServices(servicesRes.data || []);

      // Non-blocking categories fetch with fallback to loaded services
      api.getCategories()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setCategories(res.data);
          } else {
            const distinct = Array.from(new Set(servicesRes.data?.map((s) => s.category).filter(Boolean)));
            if (distinct.length) setCategories(distinct);
          }
        })
        .catch(() => {
          const distinct = Array.from(new Set(servicesRes.data?.map((s) => s.category).filter(Boolean)));
          if (distinct.length) setCategories(distinct);
        });
    } catch (err: any) {
      setError(err.message || 'Failed to load government services');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const res = await api.searchServices(query);
      setServices(res.data || []);
    } catch {
      // Fallback: client-side filter
      setServices((prev) =>
        prev.filter((s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase()) ||
          s.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-gov-navy via-gov-blue to-indigo-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <ShieldCheck className="w-96 h-96" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
            <span>🇮🇳 Government of India Citizen Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Apply, Track & Verify Citizen Services Online
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Fast, contactless public certificate delivery, direct benefit subsidies, and digital document verification with real-time audit tracking.
          </p>

          {/* Search Bar with Voice Assist Integration */}
          <div className="pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-1.5 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Search by service name, e.g. Income, Caste, Ration Card, Land..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
              <button
                onClick={onOpenVoiceAssistant}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold transition shadow-sm"
                title="Search using voice"
              >
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Voice</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Explore by Category</h2>
          <span className="text-xs text-slate-500">{services.length} services found</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedCategory === 'all'
                ? 'bg-gov-navy text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-gov-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-medium text-slate-500">Loading verified government services...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-2">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
          <button
            onClick={fetchServicesAndCategories}
            className="text-xs font-bold text-rose-800 underline hover:text-rose-950"
          >
            Retry Loading
          </button>
        </div>
      ) : services.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No services found matching your query</h3>
          <p className="text-xs text-slate-500">
            Try a different keyword or browse through our categories above.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id || service._id}
              onClick={() => onSelectService(service)}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-gov-blue/50 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
            >
              {service.popular && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Popular
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                  {service.category}
                </span>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-gov-blue transition line-clamp-1">
                  {service.name}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {service.description}
                </p>

                <div className="text-[11px] text-slate-400 font-medium truncate">
                  Dept: {service.department}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 font-bold text-gov-navy">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{service.fees === 0 ? 'Free' : `₹${service.fees}`}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{service.processingTime}</span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{service.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-gov-blue group-hover:text-gov-navy pt-1">
                  <span>View Details & Apply</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
