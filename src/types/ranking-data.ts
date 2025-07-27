export type RankingData = {
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
        caixa_dois: {
            descricao: string
            detectado: boolean
        }
        descricao: string
        pagamentos_realizados_default: {
            descricao: string
            num_pagamentos: number
            total_bruto: number
            total_taxas: number
        }
        pagamentos_realizados_fallback: {
            descricao: string
            num_pagamentos: number
            total_bruto: number
            total_taxas: number
        }
    }
    langs: string[]
    "load-balancers": string[]
    messaging: string[]
    storages: string[]
    social: string[]
    "source-code-repo": string
}
