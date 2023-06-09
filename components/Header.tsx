'use client'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import '../app/styles/header.scss';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import SearchInput from './SearchInput';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from 'next/image';
import logo from '../public/logo.webp';

const pages = [{
  icon: <HomeIcon className='header-icon' />,
  url: '',
  color: '#212F3D'
},
{
  icon: <AddBoxIcon className='header-icon' />,
  url: 'add-post',
  color: '#2ECC71'
},
{
  icon: <BookmarkIcon className='header-icon' />,
  url: 'saved-posts',
  color: '#FFE033'
},
{
  icon: <FavoriteIcon className='header-icon' />,
  url: 'liked-posts',
  color: '#DF0000'
},];

export default function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { push } = useRouter()

  const handleCloseUserMenu = async (e: string | null) => {
    if (e === 'logout') {
      await signOut()
      push('/login')
    }
    else if (!e) {
      setAnchorElUser(null);
      return
    }
    else {
      setAnchorElUser(null)
      push(e)
    }

  };

  const path = usePathname()
  const param = path.split('/')[1]

  const { data, status } = useSession();
  React.useEffect(() => {
    if (status === 'loading') return
    else if (status === 'unauthenticated') push('/login')
  }, [data, []])

  const settings = ['profile', data ? 'logout' : 'login'];
  return (
    <>
      <AppBar className='header' position="static" >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Tooltip title='home' >
              <Link href='/'>
                {/* <div className='logo'>
                  H
                </div> */}
                <Image src={logo} width={60} height={0} priority className='logo' alt='logo' />
              </Link>
            </Tooltip>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon className='text-3xl sm:text-4xl' />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page, i) => (
                  // <Tooltip key={i} title={page?.url.split('-').join(' ') || 'home'}>
                  <Link key={i} style={{
                    color: page.url === param ? page.color : '#808B96'
                  }} href={'/' + page.url} >
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography textAlign="center"> {page.icon}</Typography>
                    </MenuItem>
                  </Link>
                  // {/* </Tooltip> */}
                ))}
              </Menu>
            </Box>
            <Box className='ml-10' sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: '0px' }}>
              {pages.map((page, i) => (
                <Tooltip key={i} title={page?.url.split('-').join(' ') || 'home'}>
                  <Link href={'/' + page.url} >
                    <Button
                      className=''
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: page.url === param ? page.color : 'white', display: 'block' }}>
                      {page?.icon}
                    </Button>
                  </Link>
                </Tooltip>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <SearchInput />
            </Box>

            <Box className='ml-2 sm:ml-10' sx={{ flexGrow: 0}}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar src={data?.user?.image || ''} className='w-9 h-9 sm:w-12 sm:h-12' />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={() => handleCloseUserMenu(null)}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar >
    </>
  );
}
