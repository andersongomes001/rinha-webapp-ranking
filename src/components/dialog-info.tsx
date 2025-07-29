
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Github, Info, LinkedinIcon} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {formatMsToScientific} from "@/utils/format.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {formatUrl} from "@/utils/validator.ts";
import type {JSX} from "react";
import type {RankingData} from "@/types/ranking-data.ts";

interface DialogInfoProps {
    participant: RankingData,
    setSelectedParticipant: (value: (((prevState: (RankingData | null)) => (RankingData | null)) | RankingData | null)) => void,
    formatCurrency: (value: number) => string,
    getRankIcon: (position: number) => JSX.Element,
    selectedParticipant: RankingData | null,
    index: number
}

export function DialogInfo({
                               participant,
                               setSelectedParticipant,
                               formatCurrency,
                               getRankIcon,
                               selectedParticipant,
                               index
                           }: DialogInfoProps) {
    return (
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
                                            {selectedParticipant.storages.map(
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
                            {/*<Card className={"col-span-2"}>*/}
                            {/*    <CardHeader className="pb-2">*/}
                            {/*        <CardTitle className="text-sm">*/}
                            {/*            Tecnologias*/}
                            {/*        </CardTitle>*/}
                            {/*    </CardHeader>*/}
                            {/*    <CardContent className="space-y-2">*/}
                            {/*        <DefaulXFallback key={index} rankingData={selectedParticipant}/>*/}
                            {/*    </CardContent>*/}
                            {/*</Card>*/}
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
    );
}
