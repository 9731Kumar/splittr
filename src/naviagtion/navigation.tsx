import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

interface NavigationBarProps {
  isUserLoggedIn:boolean
}

const NavigationBar = ({isUserLoggedIn}:NavigationBarProps)=>{
    const pages = [{label:'Groups', path:'/teams'},{label:'Friends', path:'/friends'},{label:'Expenses', path:'/expenses'}  ]
    const settings = [{label:'Profile', path:'/profile'},{label:'Logout', path:'/logout'}];
    const navigate = useNavigate();
    const user = useContext<any>(UserContext);

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = (setting:any) => {
      setAnchorElUser(null);
      navigate(setting.path);
    };

    if(!isUserLoggedIn) {
      return <></>
    }
  

    return (<AppBar position="static" sx={{backgroundColor: "rgb(46 158 121)"}}>
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
        <img src="/assets/split.png" width={100} height={50} />  
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page.label}
              onClick={()=>{navigate(page.path)}}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar>{user?.name.split('')[0].toUpperCase()}</Avatar>
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
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting.label} onClick={()=>handleCloseUserMenu(setting)} >
                <Typography textAlign="center">{setting.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>)
};

export default NavigationBar;