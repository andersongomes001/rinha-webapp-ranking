"use client";

import {useState} from "react";
import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import {
    Github,
    Info,
    Search,
    LinkedinIcon,
    TwitterIcon,
    GithubIcon,
    YoutubeIcon,
    InstagramIcon,
    GlobeIcon,
} from "lucide-react";
import {formatMsToScientific} from "../utils/format.ts";
import {SortableHeader} from "./sortableHeader.tsx";
import {formatUrl} from "@/utils/validator.ts";
import type {RankingData} from "@/ranking-data.ts";
import PieChartDF from "@/components/pie-chart-df.tsx";

interface RankingTableProps {
    data: RankingData[];
}

function getNested(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => {
        return acc && acc[part];
    }, obj);
}

export function RankingTable({data}: RankingTableProps) {
    const [sortBy, setSortBy] = useState<string>("total_liquido");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [selectedParticipant, setSelectedParticipant] =
        useState<RankingData | null>(null);


    // Ordenar por total_liquido (maior para menor)
    const sortedData = [...data].sort(
        (a: RankingData, b: RankingData) => {
            let aValue: number | string, bValue: number | string;
            if (sortBy === "total_liquido") {
                aValue = a.data.total_liquido;
                bValue = b.data.total_liquido;
            } else if (sortBy === "data.p99.valor") {
                aValue = Number(getNested(a, sortBy).replace("ms", ""));
                bValue = Number(getNested(b, sortBy).replace("ms", ""));
            } else {
                aValue = getNested(a, sortBy);
                bValue = getNested(b, sortBy);
            }
            if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDir === "asc" ? 1 : -1;
            return 0
        }
    );

    const getRankIcon = (position: number) => {
        // switch (position) {
        //   case 1:
        //     return <Trophy className="h-5 w-5 text-yellow-500" />
        //   case 2:
        //     return <Medal className="h-5 w-5 text-gray-400" />
        //   case 3:
        //     return <Award className="h-5 w-5 text-amber-600" />
        //   default:
        //     return <span className="text-sm font-medium text-slate-500">#{position}</span>
        // }
        return (
            <span className="text-sm font-medium text-slate-500">#{position}</span>
        );
    };

    const handleSort = (column: string | "total_liquido") => {
        if (sortBy === column) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDir("asc");
        }
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const getLanguageColor = (lang: string) => {
        const colors: { [key: string]: string } = {
            rust: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
            javascript:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            typescript:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            python:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            java: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            go: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
            csharp:
                "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        };
        return (
            colors[lang.toLowerCase()] ||
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
        );
    };

    if (sortedData.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4"/>
                    <p className="text-lg font-medium">Nenhum participante encontrado</p>
                    <p className="text-sm">
                        Tente ajustar os filtros para ver mais resultados
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">Pos.</TableHead>
                        <TableHead>
                            <SortableHeader
                                label="Participante"
                                onClick={() => handleSort("name")}
                                active={sortBy === "name"}
                                direction={sortDir}
                            /></TableHead>
                        <TableHead>
                            <SortableHeader
                                label="Total Líquido"
                                onClick={() => handleSort("total_liquido")}
                                active={sortBy === "total_liquido"}
                                direction={sortDir}
                            />
                        </TableHead>
                        <TableHead>
                            <SortableHeader
                                label="Multa"
                                onClick={() => handleSort("data.multa.total")}
                                active={sortBy === "data.multa.total"}
                                direction={sortDir}
                            />
                        </TableHead>
                        <TableHead><SortableHeader
                            label="P99"
                            onClick={() => handleSort("data.p99.valor")}
                            active={sortBy === "data.p99.valor"}
                            direction={sortDir}
                        /></TableHead>
                        <TableHead><SortableHeader
                            label="Bônus"
                            onClick={() => handleSort("data.p99.bonus")}
                            active={sortBy === "data.p99.bonus"}
                            direction={sortDir}
                        /></TableHead>
                        <TableHead>Linguagens</TableHead>
                        <TableHead>Links</TableHead>
                        <TableHead className="w-16"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.map((participant, index) => (
                        <TableRow
                            key={participant.data.participante}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <TableCell className="font-medium">
                                {getRankIcon(index + 1)}
                            </TableCell>
                            <TableCell>
                                <div>
                                    <div className="font-medium text-slate-900 dark:text-slate-100">
                                        {participant.name}
                                    </div>
                                    {/*<div className="text-sm text-slate-500 dark:text-slate-400">@{participant.data.participante}</div>*/}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-semibold text-green-600">
                                    {formatCurrency(participant.data.total_liquido)}
                                </div>
                                <div className="text-xs text-slate-500">
                                    Bruto: {formatCurrency(participant.data.total_bruto)}
                                </div>
                                {/*<div className="text-xs text-red-500">*/}
                                {/*  Multa: {formatCurrency(participant.data.multa.total)}*/}
                                {/*</div>*/}
                            </TableCell>
                            <TableCell>
                                <div className="font-semibold text-red-500">
                                    {formatCurrency(participant.data.multa.total)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">{participant.data.p99.valor}</div>
                                <div className="text-xs text-slate-500">
                                    Max: {participant.data.p99.max_requests} req/s
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                    +{(participant.data.p99.bonus).toFixed(2)}%
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {participant.langs.map((lang) => (
                                        <Badge
                                            key={lang}
                                            variant="outline"
                                            className={`text-xs ${getLanguageColor(lang)}`}
                                        >
                                            {lang}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            className={"cursor-pointer"}
                                            variant="outline"
                                            size="sm"
                                            title={"Links, redes sociais e mais"}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                 stroke-linecap="round" stroke-linejoin="round"
                                                 className="lucide lucide-link-icon lucide-link">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                                            </svg>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                        <div className="flex gap-2">
                                            {participant?.social?.map((social, idx) => {
                                                if (social.includes("linkedin")) {
                                                    return (
                                                        <Button
                                                            className={"cursor-pointer"}
                                                            key={idx}
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={formatUrl(social)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <LinkedinIcon className="h-4 w-4 text-[#0e76a8]"/>
                                                            </a>
                                                        </Button>
                                                    );
                                                } else if (
                                                    social.includes("twitter") ||
                                                    social.includes("x.com")
                                                ) {
                                                    return (
                                                        <Button
                                                            className={"cursor-pointer"}
                                                            key={idx}
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={formatUrl(social)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <TwitterIcon className="h-4 w-4 text-[#00acee]"/>
                                                            </a>
                                                        </Button>
                                                    );
                                                } else if (social.includes("github.com")) {
                                                    return (
                                                        <Button
                                                            className={"cursor-pointer"}
                                                            key={idx}
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={formatUrl(social)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <GithubIcon className="h-4 w-4"/>
                                                            </a>
                                                        </Button>
                                                    );
                                                } else if (social.includes("youtube.com")) {
                                                    return (
                                                        <Button
                                                            className={"cursor-pointer"}
                                                            key={idx}
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={formatUrl(social)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <YoutubeIcon className="h-4 w-4 text-[#c4302b]"/>
                                                            </a>
                                                        </Button>
                                                    );
                                                } else if (social.includes("instagram")) {
                                                    return (
                                                        <Button
                                                            className={"cursor-pointer"}
                                                            key={idx}
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={formatUrl(social)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <InstagramIcon className="h-4 w-4"/>
                                                            </a>
                                                        </Button>
                                                    );
                                                }
                                                return (
                                                    <Button
                                                        className={"cursor-pointer"}
                                                        key={idx}
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a
                                                            href={formatUrl(social)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <GlobeIcon className="h-4 w-4"/>
                                                        </a>
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        title={"Ver código fonte do participante"}
                                        className={"cursor-pointer"}
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <a
                                            href={participant["source-code-repo"]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Github className="h-4 w-4"/>
                                            Código
                                        </a>
                                    </Button>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                className={"cursor-pointer"}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedParticipant(participant)}
                                                title={"Informações do participante"}
                                            >
                                                <Info className="h-4 w-4 text-red-600"/>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    {getRankIcon(index + 1)}
                                                    {participant.name}
                                                </DialogTitle>
                                            </DialogHeader>
                                            {selectedParticipant && (
                                                <div className="space-y-4">
                                                    <div className="grid lg:grid-cols-2 gap-4">
                                                        <Card>
                                                            <CardHeader className="pb-2">
                                                                <CardTitle className="text-sm">
                                                                    Financeiro
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-2">
                                                                <div className="flex justify-between">
                                                                      <span className="text-sm text-slate-600">
                                                                        Total Líquido:
                                                                      </span>
                                                                    <span className="font-semibold text-green-600">
                                                                        {formatCurrency(
                                                                            selectedParticipant.data.total_liquido
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                  <span className="text-sm text-slate-600">
                                                                    Total Bruto:
                                                                  </span>
                                                                    <span>
                                                                    {formatCurrency(
                                                                        selectedParticipant.data.total_bruto
                                                                    )}
                                                                  </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                  <span className="text-sm text-slate-600">
                                                                    Total Taxas:
                                                                  </span>
                                                                    <span className="text-red-600">
                                                                        {formatCurrency(
                                                                            selectedParticipant.data.total_taxas
                                                                        )}
                                                                      </span>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                        <Card>
                                                            <CardHeader className="pb-2">
                                                                <CardTitle className="text-sm">
                                                                    Performance
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-2">
                                                                <div className="flex justify-between">
                                                                  <span className="text-sm text-slate-600">
                                                                    P99:
                                                                  </span>
                                                                    <span>
                                                                        {formatMsToScientific(selectedParticipant.data.p99.valor).concat("ms")}


                                  </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-600">
                                    Bônus:
                                  </span>
                                                                    <span className="text-green-600">
                                    +
                                                                        {(
                                                                            selectedParticipant.data.p99.bonus
                                                                        ).toFixed(2)}
                                                                        %
                                  </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-600">
                                    Max Requests:
                                  </span>
                                                                    <span>
                                    {selectedParticipant.data.p99.max_requests}
                                                                        /s
                                  </span>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                    <div className="grid lg:grid-cols-2 gap-4">
                                                        <Card>
                                                            <CardHeader className="pb-2">
                                                                <CardTitle className="text-sm">
                                                                    Pagamentos
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-2">
                                                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-600">
                                    Sucesso:
                                  </span>
                                                                    <span className="text-green-600">
                                    {selectedParticipant.data.pagamentos_solicitados.qtd_sucesso.toLocaleString()}
                                  </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-600">
                                    Falha:
                                  </span>
                                                                    <span className="text-red-600">
                                    {selectedParticipant.data.pagamentos_solicitados.qtd_falha.toLocaleString()}
                                  </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-600">
                                    Lag:
                                  </span>
                                                                    <span>
                                    {selectedParticipant.data.lag.lag}
                                  </span>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                        <Card>
                                                            <CardHeader className="pb-2">
                                                                <CardTitle className="text-sm">
                                                                    Tecnologias
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-2">
                                                                <div>
                                  <span className="text-sm text-slate-600">
                                    Linguagens:
                                  </span>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {selectedParticipant.langs.map((lang) => (
                                                                            <Badge
                                                                                key={lang}
                                                                                variant="outline"
                                                                                className="text-xs"
                                                                            >
                                                                                {lang}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div>
                                  <span className="text-sm text-slate-600">
                                    Storage:
                                  </span>
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {selectedParticipant?.storages?.map(
                                                                            (storage) => (
                                                                                <Badge
                                                                                    key={storage}
                                                                                    variant="outline"
                                                                                    className="text-xs"
                                                                                >
                                                                                    {storage}
                                                                                </Badge>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                    <div className="grid lg:grid-cols-1 gap-4">
                                                        <Card>
                                                            <CardHeader className="pb-2">
                                                                <CardTitle className="text-sm">
                                                                    Pagamentos
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-2">
                                                                <PieChartDF
                                                                    default_router={selectedParticipant.data.pagamentos_realizados_default.num_pagamentos}
                                                                    fallback_router={selectedParticipant.data.pagamentos_realizados_fallback.num_pagamentos}
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {selectedParticipant?.social?.map((social, idx) => {
                                                            if (social.includes("linkedin")) {
                                                                return (
                                                                    <Button
                                                                        className={"cursor-pointer"}
                                                                        key={idx}
                                                                        size="sm"
                                                                        asChild
                                                                    >
                                                                        <a
                                                                            href={formatUrl(social)}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            <LinkedinIcon
                                                                                className="h-4 w-4 mr-2 text-[#0e76a8]"/>
                                                                            LinkedIn
                                                                        </a>
                                                                    </Button>
                                                                );
                                                            }
                                                            return <></>;
                                                        })}
                                                        <Button
                                                            className={"cursor-pointer"}
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={selectedParticipant["source-code-repo"]}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Github className="h-4 w-4 mr-2"/>
                                                                Código
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
