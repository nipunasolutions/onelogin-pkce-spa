import { FC } from "react";
import App from './App';
import {
    AuthProvider,
    AuthService,
    useAuth,
} from 'react-oauth2-pkce';

export const authService = new AuthService({
    provider: 'https://<Clientname>.onelogin.com/oidc/2',
    clientId: '<ClientId>',
    tokenEndpoint: 'https://<Clientname>.onelogin.com/oidc/2/token',
    redirectUri: 'http://localhost:3000',
    scopes: ['openid', 'profile'],
    location: window.location,
    authorizeEndpoint: 'https://<Clientname>.onelogin.com/oidc/2/auth'
});

export function PKCEApp() {
    const { authService } = useAuth();

    const login = async () => authService.authorize();
    const logout = async () => authService.logout();

    if (authService.isPending()) {
        return <div>
            Loading...
            <button onClick={() => { logout(); login(); }}>Reset</button>
        </div>;
    }

    if (!authService.isAuthenticated()) {
        return (
            <div>
                <p>Not Logged in yet</p>
                <button onClick={login}>Login</button>
            </div>
        );
    }

    const token = authService.getAuthTokens();

    //Demo to send GET request to resource server with id_token in the header

    fetch('http://localhost:8085/principle', {
        method: 'GET', // or 'PUT'
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.id_token,
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Headers': "*"
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    return (
        <div>
            <button onClick={logout}>Logout</button>
            <App />
        </div>
    );
}


export const OneloginSecuredWrapper: FC<{}> = () =>
    <AuthProvider authService={authService} >
        <PKCEApp />
    </AuthProvider>


export default OneloginSecuredWrapper;    
