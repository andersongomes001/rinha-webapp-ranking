import { useState, useEffect, useMemo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X, Search, Filter, RefreshCw } from "lucide-react";
import type { RankingData } from "../ranking-data";

interface RankingFiltersProps {
  data: RankingData[];
  onFilterChange: (filteredData: RankingData[]) => void;
  isRefreshing: boolean;
  handleRefresh?: () => void;
}

export function RankingFilters({
  data,
  onFilterChange,
  isRefreshing,
  handleRefresh,
}: RankingFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("todos");
  const [selectedStorage, setSelectedStorage] = useState<string>("todos");
  const [selectedMessaging, setSelectedMessaging] = useState<string>("todos");
  const [selectedLoadBalancer, setSelectedLoadBalancer] =
    useState<string>("todos");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const [minValueInput, setMinValueInput] = useState("");
  const [maxValueInput, setMaxValueInput] = useState("");
  // Debounce minValueInput
  useEffect(() => {
    const handler = setTimeout(() => {
      setMinValue(minValueInput);
    }, 400); // espera 400ms após a última tecla

    return () => clearTimeout(handler);
  }, [minValueInput]);

  // Debounce maxValueInput
  useEffect(() => {
    const handler = setTimeout(() => {
      setMaxValue(maxValueInput);
    }, 400);

    return () => clearTimeout(handler);
  }, [maxValueInput]);

  // Extrair opções únicas dos dados
  const filterOptions = useMemo(() => {
    const languages = [...new Set(data.flatMap((item) => item.langs || []))]
      .filter((lang) => lang && lang.trim() !== "")
      .sort();
    const storages = [...new Set(data.flatMap((item) => item.storages || []))]
      .filter((storage) => storage && storage.trim() !== "")
      .sort();
    const messaging = [...new Set(data.flatMap((item) => item.messaging || []))]
      .filter((msg) => msg && msg.trim() !== "")
      .sort();
    const loadBalancers = [
      ...new Set(data.flatMap((item) => item["load-balancers"] || [])),
    ]
      .filter((lb) => lb && lb.trim() !== "")
      .sort();

    return { languages, storages, messaging, loadBalancers };
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...data];

    // Filtro de busca por nome/participante
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.data.participante
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.langs?.some((lang: string) =>
            lang.toUpperCase().includes(selectedLanguage.toUpperCase())
          )
      );
    }

    // Filtro por linguagem
    if (selectedLanguage !== "todos") {
      filtered = filtered.filter((item) => {
        return (
          item.langs?.some(
            (lang: string) =>
              lang.toUpperCase() === selectedLanguage.toUpperCase()
          ) ?? false
        );
      });
    }

    // Filtro por storage
    if (selectedStorage !== "todos") {
      filtered = filtered.filter((item) => {
        return (
          item.storages?.some(
            (storage: string) =>
              storage.toUpperCase() === selectedStorage.toUpperCase()
          ) ?? false
        );
      });
    }

    // Filtro por messaging
    if (selectedMessaging !== "todos") {
      filtered = filtered.filter((item) => {
        return (
          item.messaging?.some(
            (msg: string) =>
              msg.toUpperCase() === selectedMessaging.toUpperCase()
          ) ?? false
        );
      });
    }

    // Filtro por load balancer
    if (selectedLoadBalancer !== "todos") {
      filtered = filtered.filter((item) => {
        return (
          item["load-balancers"]?.some(
            (lb: string) =>
              lb.toUpperCase() === selectedLoadBalancer.toUpperCase()
          ) ?? false
        );
      });
    }

    // Filtro por valor mínimo
    if (minValue) {
      const min = Number.parseFloat(minValue);
      if (!isNaN(min)) {
        filtered = filtered.filter((item) => item.data.total_liquido >= min);
      }
    }

    // Filtro por valor máximo
    if (maxValue) {
      const max = Number.parseFloat(maxValue);
      if (!isNaN(max)) {
        filtered = filtered.filter((item) => item.data.total_liquido <= max);
      }
    }

    onFilterChange(filtered);
  }, [
    data,
    searchTerm,
    selectedLanguage,
    selectedStorage,
    selectedMessaging,
    selectedLoadBalancer,
    minValue,
    maxValue,
  ]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedLanguage("todos");
    setSelectedStorage("todos");
    setSelectedMessaging("todos");
    setSelectedLoadBalancer("todos");
    setMinValue("");
    setMaxValue("");
    setMinValueInput("");
    setMaxValueInput("");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedLanguage !== "todos" ||
    selectedStorage !== "todos" ||
    selectedMessaging !== "todos" ||
    selectedLoadBalancer !== "todos" ||
    minValue ||
    maxValue;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <div className={"flex gap-2"}>
            <Button
              title={"Atualizar dados (a API é atualizada a cada 5 minutos)"}
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="sm"
              className="flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Atualizando..." : "Atualizar"}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                disabled={isRefreshing}
                className={"cursor-pointer"}
              >
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca por nome */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={isRefreshing}
          />
        </div>

        {/* Filtros em grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Linguagem
            </label>
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
              disabled={isRefreshing}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                {filterOptions.languages
                  .filter((lang) => lang && lang.trim() !== "")
                  .map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Storage
            </label>
            <Select
              value={selectedStorage}
              onValueChange={setSelectedStorage}
              disabled={isRefreshing}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {filterOptions.storages
                  .filter((storage) => storage && storage.trim() !== "")
                  .map((storage) => (
                    <SelectItem key={storage} value={storage}>
                      {storage}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Messaging
            </label>
            <Select
              value={selectedMessaging}
              onValueChange={setSelectedMessaging}
              disabled={isRefreshing}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {filterOptions.messaging
                  .filter((msg) => msg && msg.trim() !== "")
                  .map((msg) => (
                    <SelectItem key={msg} value={msg}>
                      {msg}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Load Balancer
            </label>
            <Select
              value={selectedLoadBalancer}
              onValueChange={setSelectedLoadBalancer}
              disabled={isRefreshing}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {filterOptions.loadBalancers
                  .filter((lb) => lb && lb.trim() !== "")
                  .map((lb) => (
                    <SelectItem key={lb} value={lb}>
                      {lb}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Valor (R$)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={minValueInput}
                onChange={(e) => setMinValueInput(e.target.value)}
                className="text-xs"
                disabled={isRefreshing}
              />
              <Input
                placeholder="Max"
                type="number"
                value={maxValueInput}
                onChange={(e) => setMaxValueInput(e.target.value)}
                className="text-xs"
                disabled={isRefreshing}
              />
            </div>
          </div>
        </div>

        {/* Filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Filtros ativos:
            </span>
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Busca: "{searchTerm}"
                <Button
                  variant="ghost"
                  size={"sm"}
                  onClick={() => {
                    setSearchTerm("");
                  }}
                >
                  <X className="h-3 w-3 cursor-pointer" />
                </Button>
              </Badge>
            )}
            {selectedLanguage !== "todos" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedLanguage}
                <Button
                  variant="ghost"
                  size={"sm"}
                  onClick={() => setSelectedLanguage("todos")}
                >
                  <X className="h-3 w-3 cursor-pointer" />
                </Button>
              </Badge>
            )}
            {selectedStorage !== "todos" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Storage: {selectedStorage}
                <Button
                  variant="ghost"
                  size={"sm"}
                  onClick={() => setSelectedStorage("todos")}
                >
                  <X className="h-3 w-3 cursor-pointer" />
                </Button>
              </Badge>
            )}
            {selectedMessaging !== "todos" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Messaging: {selectedMessaging}
                <Button
                  variant="ghost"
                  size={"sm"}
                  onClick={() => setSelectedMessaging("todos")}
                >
                  <X className="h-3 w-3 cursor-pointer" />
                </Button>
              </Badge>
            )}
            {selectedLoadBalancer !== "todos" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                LB: {selectedLoadBalancer}
                <Button
                  variant="ghost"
                  size={"sm"}
                  onClick={() => setSelectedLoadBalancer("todos")}
                >
                  <X className="h-3 w-3 cursor-pointer" />
                </Button>
              </Badge>
            )}
            {(minValue || maxValue) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                R$ {minValue || "0"} - {maxValue || "∞"}
                <Button
                  variant="ghost"
                  size={"sm"}
                  onClick={() => {
                    setMinValueInput("");
                    setMaxValueInput("");
                  }}
                >
                  <X className="h-3 w-3 cursor-pointer" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
