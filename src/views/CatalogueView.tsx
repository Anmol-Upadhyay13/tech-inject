import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Layers,
  ArrowRight,
  Filter,
  Check,
  Lock,
  Sparkles,
} from 'lucide-react';
import { ComponentItem, ComponentCategory, AccessLevel } from '../../packages/types/component.ts';
import { Button } from '../../packages/ui/Button.tsx';
import { Badge } from '../../packages/ui/Badge.tsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../packages/ui/Card.tsx';
import { SearchInput } from '../../packages/ui/SearchInput.tsx';

interface CatalogueViewProps {
  components: ComponentItem[];
  onSelectComponent: (slug: string) => void;
}

const CATEGORIES: Array<ComponentCategory | 'All'> = [
  'All',
  'Actions',
  'Forms',
  'Feedback',
  'Data Display',
  'Navigation',
  'Layout',
  'Overlay',
];

export function CatalogueView({ components, onSelectComponent }: CatalogueViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'All'>('All');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'newest' | 'category'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredComponents = useMemo(() => {
    return components
      .filter((comp) => {
        // Search filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          comp.name.toLowerCase().includes(q) ||
          comp.description.toLowerCase().includes(q) ||
          comp.category.toLowerCase().includes(q);

        // Category filter
        const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory;

        // Access level filter
        const matchesAccess = accessFilter === 'all' || comp.accessLevel === accessFilter;

        return matchesSearch && matchesCategory && matchesAccess;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'category') return a.category.localeCompare(b.category);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [components, searchQuery, selectedCategory, accessFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Catalogue Header & Description */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-mono">
          <span>Catalogue</span>
          <span aria-hidden="true">·</span>
          <span>{filteredComponents.length} of {components.length} components</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Component Catalogue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Search, filter, and inspect production-ready components built for high-density B2B interfaces.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="w-full sm:max-w-md">
            <SearchInput
              placeholder="Search components by name or prop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Access Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setAccessFilter('all')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                  accessFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setAccessFilter('free')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                  accessFilter === 'free' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setAccessFilter('premium')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                  accessFilter === 'premium' ? 'bg-white text-purple-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Pro</span>
              </button>
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 px-2.5 text-xs rounded-md bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="category">Sort: Category</option>
              <option value="newest">Sort: Recently Added</option>
            </select>

            {/* View Mode */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-md border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1 rounded cursor-pointer ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills (Interactive Filter Controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Component Grid / List */}
      {filteredComponents.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-900">No components found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No components matched your search query "{searchQuery}" and selected filters.
          </p>
          <Button
            size="sm"
            variant="secondary"
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setAccessFilter('all');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComponents.map((comp) => (
            <Card
              key={comp.id}
              variant="interactive"
              onClick={() => onSelectComponent(comp.slug)}
              className="flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {comp.category}
                  </span>
                  <Badge variant={comp.accessLevel === 'premium' ? 'premium' : 'neutral'}>
                    {comp.accessLevel === 'premium' ? 'PRO' : 'FREE'}
                  </Badge>
                </div>
                <CardTitle className="text-base text-slate-900">{comp.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">{comp.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="p-4 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center min-h-[90px] text-xs text-slate-400">
                  <div className="flex flex-col items-center gap-1.5">
                    <Layers className="w-5 h-5 text-slate-400" />
                    <span>{comp.previewData?.variants?.length || 1} preview variants</span>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-slate-500">v{comp.version}</span>
                <span className="text-indigo-600 font-semibold flex items-center gap-1">
                  Inspect Component <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white divide-y divide-slate-100">
          {filteredComponents.map((comp) => (
            <div
              key={comp.id}
              onClick={() => onSelectComponent(comp.slug)}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">{comp.name}</span>
                    <span className="text-xs text-slate-400 font-mono">v{comp.version}</span>
                    <Badge variant={comp.accessLevel === 'premium' ? 'premium' : 'neutral'}>
                      {comp.accessLevel === 'premium' ? 'PRO' : 'FREE'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{comp.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                <span className="hidden sm:inline font-mono">{comp.category}</span>
                <Button size="sm" variant="secondary">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
