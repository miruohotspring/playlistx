'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  Alert,
  Link,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { getLinkedProviders } from '@serverActions/getLinkedProviders';
import type { LinkedProviderMeta } from '@serverActions/getLinkedProviders';
import { ProviderType } from '@common/constants';
import { OpenInNew } from '@mui/icons-material';

interface ProviderInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const Settings = () => {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Record<string, LinkedProviderMeta> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const providerInfo: Record<ProviderType, ProviderInfo> = {
    google: {
      name: 'YouTube',
      description: 'YouTubeアカウントとの連携',
      icon: (
        <Image width="34" height="24" src="/icons/youtube.png" alt="YouTube" />
      ),
      color: '#FF0000',
    },
    spotify: {
      name: 'Spotify',
      description: 'Spotifyアカウントとの連携',
      icon: (
        <Image width="24" height="24" src="/icons/spotify.png" alt="Spotify" />
      ),
      color: '#1DB954',
    },
    soundcloud: {
      name: 'SoundCloud',
      description: 'SoundCloudアカウントとの連携',
      icon: (
        <Image
          width="34"
          height="24"
          src="/icons/soundcloud-dark.png"
          alt="Spotify"
        />
      ),
      color: '#FF5500',
    },
  };

  useEffect(() => {
    async function fetchProviders() {
      try {
        const linkedProviders = await getLinkedProviders();
        setProviders(linkedProviders);
      } catch (error) {
        console.error('Failed to fetch linked providers:', error);
        showNotification('プロバイダー情報の取得に失敗しました', 'error');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchProviders();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleConnect = async (provider: string) => {
    await signIn(provider, { callbackUrl: '/settings' });
  };

  const handleDisconnect = async (provider: string) => {
    try {
      const response = await fetch('/api/auth/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      });

      if (response.ok) {
        setProviders((prev) => (prev ? { ...prev, [provider]: { linked: false } } : null));
        showNotification(
          `${providerInfo[provider].name}との連携を解除しました`,
          'success',
        );
      } else {
        showNotification(
          `${providerInfo[provider].name}との連携解除に失敗しました`,
          'error',
        );
      }
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error);
      showNotification(
        `${providerInfo[provider].name}との連携解除に失敗しました`,
        'error',
      );
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            アカウント連携
          </Typography>
          <Typography>
            アカウント連携を管理するにはログインしてください。
          </Typography>
          <Button variant="contained" onClick={() => signIn()} sx={{ mt: 2 }}>
            ログイン
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          アカウント連携
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          音楽サービスとの連携を管理します。連携することで、各サービスのプレイリストを統合して利用できます。
        </Typography>

        <List>
          {Object.entries(providerInfo).map(([provider, info]) => (
            <React.Fragment key={provider}>
              <ListItem>
                <ListItemIcon>{info.icon}</ListItemIcon>
                <ListItemText
                  primary={info.name}
                  secondary={
                    providers?.[provider].providerUserName &&
                      providers?.[provider].providerProfileUrl ? (
                      <Link
                        href={providers?.[provider].providerProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="text.secondary"
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                      >
                        {providers?.[provider].providerUserName}
                        <OpenInNew fontSize="inherit" />
                      </Link>
                    ) : (
                      info.description
                    )
                  }
                />
                <ListItemSecondaryAction>
                  {providers?.[provider].linked ? (
                    <>
                      <Chip
                        label="連携済み"
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDisconnect(provider)}
                      >
                        連携解除
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleConnect(provider)}
                      sx={{
                        bgcolor: info.color,
                        '&:hover': { bgcolor: info.color, opacity: 0.9 },
                        color: 'white',
                      }}
                    >
                      連携する
                    </Button>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              {provider !== 'soundcloud' && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
