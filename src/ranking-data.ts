export interface RankingData {
    name: string
    data: {
        participante: string
        total_liquido: number
        total_bruto: number
        total_taxas: number
        p99: {
            valor: string
            bonus: number
            max_requests: string
        }
        multa: {
            porcentagem: number
            total: number
        }
        lag: {
            lag: number
            num_pagamentos_solicitados: number
            num_pagamentos_total: number
        }
        pagamentos_solicitados: {
            qtd_sucesso: number
            qtd_falha: number
        }
    }
    langs: string[]
    "load-balancers": string[]
    messaging: string[]
    storages: string[]
    social: string[]
    "source-code-repo": string
}
