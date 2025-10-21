import type { ReactNode } from 'react';
import { Container, Typography, Box, Divider, Paper } from '@mui/material';

export default function Page(): ReactNode {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
          }}
        >
          {/* ヘッダー */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              m3usick
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
              利用規約とプライバシーポリシー
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
              最終更新日: 2025年10月22日
            </Typography>
          </Box>

          {/* 利用規約セクション */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#667eea',
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              利用規約
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              1. サービスについて
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}
            >
              m3usickは、ユーザーが音楽プレイリストを作成・管理・共有できるプラットフォームです。本サービスを利用することで、以下の利用規約に同意したものとみなされます。
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              2. アカウント
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}
            >
              本サービスの利用には、Googleアカウントによる認証が必要です。アカウント情報は適切に管理し、第三者に開示しないでください。
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              3. 禁止事項
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 1 }}
            >
              以下の行為を禁止します：
            </Typography>
            <Box component="ul" sx={{ color: '#555', lineHeight: 1.8, pl: 3 }}>
              <li>著作権を侵害する行為</li>
              <li>他のユーザーに迷惑をかける行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>不正アクセスやスクレイピング</li>
            </Box>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              4. 免責事項
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}
            >
              本サービスは現状有姿で提供されます。サービスの中断、データの消失、その他の損害について、当社は一切の責任を負いません。
            </Typography>
          </Box>

          <Divider sx={{ my: 5 }} />

          {/* プライバシーポリシーセクション */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#764ba2',
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              プライバシーポリシー
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              1. 収集する情報
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 1 }}
            >
              当社は以下の情報を収集します：
            </Typography>
            <Box
              component="ul"
              sx={{ color: '#555', lineHeight: 1.8, pl: 3, mb: 2 }}
            >
              <li>
                Googleアカウントから提供される基本情報（名前、メールアドレス、プロフィール画像）
              </li>
              <li>プレイリストの作成・編集履歴</li>
              <li>サービス利用に関するログ情報</li>
            </Box>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              2. 情報の利用目的
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 1 }}
            >
              収集した情報は以下の目的で利用します：
            </Typography>
            <Box
              component="ul"
              sx={{ color: '#555', lineHeight: 1.8, pl: 3, mb: 2 }}
            >
              <li>サービスの提供と改善</li>
              <li>ユーザーサポート</li>
              <li>不正利用の防止</li>
              <li>統計データの作成</li>
            </Box>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              3. 情報の第三者提供
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}
            >
              ユーザーの同意なく、個人情報を第三者に提供することはありません。ただし、法令に基づく場合や、サービス提供に必要な範囲で業務委託先に提供する場合があります。
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              4. Cookie等の利用
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}
            >
              本サービスでは、利便性向上のためCookieを使用します。Cookieの使用を望まない場合は、ブラウザの設定で無効化できます。
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              5. セキュリティ
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}
            >
              個人情報の漏洩、滅失、毀損を防止するため、適切なセキュリティ対策を実施しています。
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: '#555', fontWeight: 600, mt: 3, mb: 2 }}
            >
              6. お問い合わせ
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#555', lineHeight: 1.8, mb: 2 }}
            >
              本ポリシーに関するお問い合わせは、miruohotspring@gmail.comまでご連絡ください。
            </Typography>
          </Box>

          {/* フッター */}
          <Box
            sx={{
              mt: 5,
              pt: 3,
              borderTop: '1px solid #e0e0e0',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: '#999' }}>
              © 2025 miruohotspring. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
