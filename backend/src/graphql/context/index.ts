import { ExpressContextFunctionArgument } from '@as-integrations/express5'
import { JwtPayload, verifyJwt } from '../../utils/jwt'

export type GraphqlContext = {
    user: string | undefined
    userPayload?: JwtPayload
    token: string | undefined
    req: ExpressContextFunctionArgument['req']
    res: ExpressContextFunctionArgument['res']
}

export const buildContext = async ({req, res}: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
    const authHeader = req.headers.authorization
    let user: string | undefined
    let userPayload: JwtPayload | undefined
    let token: string | undefined

    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring('Bearer '.length)
        try {
            const payload = verifyJwt(token) as JwtPayload
            user = payload.id
            userPayload = payload
        } catch (error) {}
    }
    return { user, userPayload, token, req, res }
}