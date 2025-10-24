'use client';

import type { ProviderType } from '@common/constants';
import { PageContainer, useNotification } from '@components/ui';
import { Logout, OpenInNew } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { getLinkedProviders } from '@serverActions/getLinkedProviders';
import type { LinkedProviderMeta } from '@serverActions/getLinkedProviders';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ProviderInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const Settings = () => {
  const { data: session, status } = useSession();
  const { showNotification } = useNotification();
  const [providers, setProviders] = useState<Record<
    string,
    LinkedProviderMeta
  > | null>(null);
  const [loading, setLoading] = useState(true);

  const providerInfo: Record<ProviderType, ProviderInfo> = {
    google: {
      name: 'Google',
      description: 'Googleアカウントとの連携',
      icon: (
        <Box
          component="img"
          src="https://www.google.com/favicon.ico"
          alt="Google"
          sx={{ width: '32px', height: '32px' }}
        />
      ),
      color: 'inherit',
    },
    spotify: {
      name: 'Spotify',
      description: 'Spotifyアカウントとの連携',
      icon: (
        <Image width="32" height="32" src="/icons/spotify.png" alt="Spotify" />
      ),
      color: 'inherit',
    },
    soundcloud: {
      name: 'SoundCloud',
      description: 'SoundCloudアカウントとの連携',
      icon: (
        <Box
          component="img"
          src="/icons/soundcloud-dark.png"
          alt="Soundcloud"
          sx={{ width: '32px', height: '32px' }}
        />
      ),
      color: 'inherit',
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
  }, [status, showNotification]);

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
        setProviders((prev) =>
          prev ? { ...prev, [provider]: { linked: false } } : null,
        );
        showNotification(
          `${providerInfo[provider as ProviderType].name}との連携を解除しました`,
          'success',
        );
      } else {
        showNotification(
          `${providerInfo[provider as ProviderType].name}との連携解除に失敗しました`,
          'error',
        );
      }
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error);
      showNotification(
        `${providerInfo[provider as ProviderType].name}との連携解除に失敗しました`,
        'error',
      );
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (loading) {
    return (
      <PageContainer disablePaper containerSx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!session) {
    return (
      <PageContainer>
        <Typography variant="h6" gutterBottom>
          アカウント連携
        </Typography>
        <Typography>
          アカウント連携を管理するにはログインしてください。
        </Typography>
        <Button variant="contained" onClick={() => signIn()} sx={{ mt: 2 }}>
          ログイン
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Typography variant="h5" gutterBottom>
        アカウント連携
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        音楽サービスとの連携を管理します。連携することで、各サービスのプレイリストを統合して利用できます。
      </Typography>
      <Alert variant="outlined" severity="warning">
        Googleアカウント連携を解除すると、再度ログインすることが出来なくなります。
      </Alert>

      <List>
        {Object.entries(providerInfo).map(([provider, info]) => (
          <React.Fragment key={provider}>
            <ListItem>
              <ListItemIcon>{info.icon}</ListItemIcon>
              <ListItemText
                primary={info.name}
                secondary={
                  providers?.[provider]?.providerUserName &&
                  providers?.[provider]?.providerProfileUrl ? (
                    <Link
                      href={providers?.[provider]?.providerProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      color="text.secondary"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      {providers?.[provider]?.providerUserName}
                      <OpenInNew fontSize="inherit" />
                    </Link>
                  ) : (
                    info.description
                  )
                }
              />
              <ListItemSecondaryAction>
                {providers?.[provider]?.linked ? (
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
                    variant="outlined"
                    size="small"
                    onClick={() => handleConnect(provider)}
                    sx={{ outlineColor: info.color, color: 'inherit' }}
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
      <Button
        variant="outlined"
        color="error"
        startIcon={<Logout />}
        onClick={handleLogout}
      >
        ログアウト
      </Button>
    </PageContainer>
  );
};

export default Settings;
