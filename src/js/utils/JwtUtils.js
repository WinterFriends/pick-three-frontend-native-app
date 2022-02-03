import jwt_decode from "jwt-decode";

class JwtUtils {
    static getTokenState(accessToken, refreshToken) {
        let decodedAccessToken = jwt_decode(accessToken);
        let accessTokenExp = decodedAccessToken.exp * 1000;
        let decodedRefreshToken = jwt_decode(refreshToken);
        let refreshTokenExp = decodedAccessToken.exp * 1000;

        let now = new Date().getTime();

        let offset = (24 * 60 * 60 * 1000) * 3;    // 3일 

        let state = TokenState.None;

        // 기본
        if (now < accessTokenExp - offset) {

        }
        // 리프레쉬 필요
        else if (accessTokenExp - offset < now && now < refreshTokenExp) {
            state = TokenState.NeedRefresh;
        }
        // 재로그인 필요
        else if (refreshTokenExp < now) {
            state = TokenState.NeedRelogin;
        }

        return state;
    }
}

const TokenState = {
    None: 0,
    NeedRefresh: 1,
    NeedRelogin: 2
};

export default JwtUtils;
export { TokenState };