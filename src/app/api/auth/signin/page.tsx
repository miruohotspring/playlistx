'use client';
import { Box, Button, Typography, Container, Link } from '@mui/material';
import { signIn } from 'next-auth/react';
import React from 'react';

export default function SignInPage() {
  const handleGoogleSignIn = () => signIn('google', { callbackUrl: '/' });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'moveBackground 20s linear infinite',
        },
        '@keyframes moveBackground': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: { xs: '40px 24px', sm: '60px 48px' },
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* 音符アイコン */}
          <Box
            sx={{
              fontSize: '64px',
              marginBottom: '16px',
              animation: 'bounce 2s ease-in-out infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }}
          >
            🎵
          </Box>

          {/* サービス名 */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '48px', sm: '64px' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            m3usick
          </Typography>

          {/* キャッチコピー */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '20px', sm: '24px' },
              fontWeight: 600,
              color: '#333',
              marginBottom: '40px',
              lineHeight: 1.4,
            }}
          >
            そうだ、プレイリストを作ろう
          </Typography>

          {/* 説明文 */}
          <Typography
            sx={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '32px',
              lineHeight: 1.6,
            }}
          >
            Googleアカウントでかんたんに始められます
            <br />
            あなただけの音楽体験を今すぐスタート
          </Typography>

          {/* Googleサインインボタン */}
          <Button
            onClick={handleGoogleSignIn}
            aria-label="Sign in with Google"
            sx={{
              backgroundColor: '#fff',
              color: '#333',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '12px',
              border: '2px solid #e0e0e0',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              maxWidth: '320px',
              margin: '0 auto',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                borderColor: '#667eea',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            <Box
              component="img"
              src="https://www.google.com/favicon.ico"
              alt="Google"
              sx={{ width: '20px', height: '20px' }}
            />
            Googleで始める
          </Button>

          {/* フッターテキスト */}
          <Typography
            sx={{
              fontSize: '12px',
              color: '#999',
              marginTop: '24px',
            }}
          >
            サインインすることで
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#667eea',
                textDecoration: 'underline',
                '&:hover': {
                  color: '#764ba2',
                },
              }}
            >
              利用規約とプライバシーポリシー
            </Link>
            に同意したものとみなされます
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
