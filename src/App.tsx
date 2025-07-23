import { useEffect, useState } from "react";
import "./App.css";
import { Loader2, GithubIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import type { RankingData } from "./ranking-data";
import { RankingFilters } from "./components/ranking-filters";
import { RankingTable } from "./components/ranking-table";
import { RankingLangs } from "./components/ranking-langs";

function App() {
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [filteredData, setFilteredData] = useState<RankingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTheme } = useTheme();

  const fetchRankingData = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      console.log("Tentando buscar dados da API...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

      const response = await fetch(
        "https://rinha-api-ranking.onrender.com/ranking",
        {
          cache: "no-store",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RankingData[] = await response.json();
      console.log("Dados recebidos da API:", data.length, "participantes");

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Dados inválidos recebidos da API");
      }
      setRankingData(data);
      setFilteredData(data);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      console.log("Usando dados de exemplo...");
      setError(
        "Não foi possível conectar com a API. Exibindo dados de exemplo."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setTheme("dark");
    fetchRankingData();
  }, []);

  const handleRefresh = () => {
    fetchRankingData(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Carregando ranking...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 w-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              🏆 Ranking da Rinha de Backend 2025
            </h1>

            {/*<Button*/}
            {/*    onClick={handleRefresh}*/}
            {/*    disabled={isRefreshing}*/}
            {/*    className="flex items-center gap-2"*/}
            {/*>*/}
            {/*    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}/>*/}
            {/*    {isRefreshing ? "Atualizando..." : "Atualizar"}*/}
            {/*</Button>*/}

            {/*{theme === "light" ? (<Button onClick={() => setTheme("dark")}>*/}
            {/*    <MoonIcon/>*/}
            {/*</Button>) : (<Button onClick={() => setTheme("light")}>*/}
            {/*    <SunIcon/>*/}
            {/*</Button>)}*/}
          </div>
          {error && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Aviso:</span>
                <span>{error}</span>
              </div>
            </div>
          )}
          <div>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A Rinha de Backend é um desafio em que é necessário desenvolver
              uma solução backend em qualquer tecnologia e tem como principal
              objetivo o aprendizado e compartilhamento de conhecimento! Esta é
              a terceira edição do desafio.
            </p>
            <Alert
              variant="destructive"
              className="text-lg font-semibold max-w-2xl mx-auto mb-3"
            >
              <AlertTitle>Importante!</AlertTitle>
              <AlertDescription>
                A data limite para submeter seu backend é 2025-08-17 até as
                23:59:59! A previsão para a divulgação dos resultados é para o
                dia 2025-08-20.
              </AlertDescription>
            </Alert>

            <Button variant="outline" size={"sm"} asChild>
              <a
                href={"https://github.com/zanfranceschi/rinha-de-backend-2025"}
                target={"_blank"}
              >
                <GithubIcon className="h-4 w-4 mr-2" />
                Repositório do Desafio
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total de Participantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {filteredData.length}
              </div>
              {filteredData.length !== rankingData.length && (
                <div className="text-sm text-slate-500">
                  de {rankingData.length} total
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Maior Total Líquido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R${" "}
                {filteredData.length > 0
                  ? Math.max(
                      ...filteredData.map(
                        (p: RankingData) => p.data.total_liquido
                      )
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0,00"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Linguagens Encontradas{" "}
              </CardTitle>
            </CardHeader>
            <CardContent className={"flex flex-row gap-2"}>
              <div className="text-2xl font-bold text-blue-600">
                {filteredData.length > 0
                  ? [
                      ...new Set(
                        filteredData.flatMap((p: RankingData) => p.langs)
                      ),
                    ].length
                  : 0}
              </div>
              <RankingLangs rankingData={rankingData} />
            </CardContent>
          </Card>
        </div>

        {/*<RankingFilters data={rankingData} onFilterChange={(e) => setFilteredData(e) } isRefreshing={isRefreshing}/>*/}

        <RankingFilters
          data={rankingData}
          onFilterChange={setFilteredData}
          isRefreshing={isRefreshing}
          handleRefresh={handleRefresh}
        />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Prévia do Resultados</CardTitle>
            <CardDescription>
              {filteredData.length === rankingData.length
                ? "Todos os participantes ordenados por total líquido"
                : `${filteredData.length} participantes encontrados`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <RankingTable data={filteredData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
