import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import * as jose from 'jose';
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

async function signOAuthAssertion(payload: Record<string, any>) {
    const privatePem = process.env.FE_JWS_PRIVATE_PEM!;
    const iss = process.env.FE_JWS_ISS ?? "second-brain-web";
    const aud = process.env.FE_JWS_AUD ?? "second-brain-be";
    const alg = "ES256"; // matches the key we generated
  
    const pk = await jose.importPKCS8(privatePem, alg);
    return new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer(iss)
      .setAudience(aud)
      .setExpirationTime("60s")              // short lived assertion
      .sign(pk);
}




 
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as any;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: String(profile.sub),
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        } as any;
      },
    }),
    Credentials({
        name: "Email & Password",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const email = credentials?.email?.toString().toLowerCase().trim();
          const password = credentials?.password ?? "";
          if (!email || !password) return null;

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
          });
  
          if (!res.ok) {
            return null;
          }
          const user = await res.json(); // { accessToken, refreshToken?, expiresAt?  }
          if (!user) {
            return null;
          }

          return user; 
        },
      })
  ],
  callbacks: {
    async jwt({ token, user , account }) {
        if (user) {
            token.id = (user as any).id;
        }

     if(account  && (account?.provider === 'google' || account?.provider === 'github')){

        // code for oauth-exchange
        const assertion = await signOAuthAssertion({
          user_id: token.id,
          email: token.email,
          name: token.name,
          avatar_url: token.image,
        });

        const exchangeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assertion  , provider: account?.provider}),
          cache: "no-store",
        });

        if(!exchangeRes.ok){
            // throw error invalidate login
            console.log('error in exchange')
            token ={}
            return token;
        }

        const exchangeData = await exchangeRes.json();
        token.accessToken =  exchangeData.access_token;
        token.refreshToken =  exchangeData.refresh_token;
        token.expiresAt =  exchangeData.expires_at;
        
        

        console.log('run me')
     }

     // from login
     if(user && account?.provider === 'credentials'){
        token.accessToken =  (user as any).accessToken;
        token.refreshToken =  (user as any).refreshToken;
        token.expiresAt =  (user as any).expiresAt;
        // token.id =  user.id;
        // token.name =  user.name;
        // token.email =  user.email;
        // token.image =  (user as any).avatar_url;
     }

      const now = Math.floor(Date.now() / 1000);
      if (token.expiresAt && now > (Number(token.expiresAt) - 60) && token.expiresAt) {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json(); // { accessToken, refreshToken?, expiresAt }
          token.accessToken = refreshData.accessToken;
          token.refreshToken = refreshData.refreshToken ?? token.refreshToken;
          token.expiresAt = refreshData.expiresAt ?? token.expiresAt;
        }
      }

      if(!token.id || !token.name ||!token.email){

        // get these via me api call
        const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          method: "GET",
          headers: { "content-type": "application/json", "Authorization": `Bearer ${token.accessToken}` },
          cache: "no-store",
        });

        if (!meRes.ok) {
          token = {};
          return token;
        }

        const meData = await meRes.json();
        token.id = meData.id;
        token.name = meData.name;
        token.email = meData.email;
        token.image = meData.avatar_url;

      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      
      return session;
    },
  },
});