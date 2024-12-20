import React, { useEffect, useState } from 'react';
import logo from '../../src/assets/logo.png';
import profile from '../../src/assets/user.png'
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from '../UserContext';
import PATH from '../PATH';
import { useNavigate } from 'react-router';

const NavBar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading} = useAuth0();
  const { aura, setAura, currentTab, setCurrentTab } = useUser();
  const navigate = useNavigate();

  useEffect(
    () => {
      const fetchAura = async() => {
        const username = user.nickname;
        const data = await fetch(`${PATH}/aura/${username}`, {
          method: "GET",
        })
        
        const aura = await data.json();
        setAura(aura.aura)
      }
      if(!user)
        return

      fetchAura()
    }, [user, setAura]
  )

  const changeTab = (tab) => {
    if(currentTab != tab) setCurrentTab(tab)
  }
  


  return (
      <nav className="px-32 flex justify-between items-center bg-white text-black border-b-2 border-platinum-50">
          <div id="brand" className="flex justify-between items-center">
          <img src={logo} className="h-6 m-0"></img>
          <a className="manrope-700 text-lg mx-4" href="/">esCode</a>
          <div id="navMenu" className="hidden justify-between items-center md:flex align-center text-md text-gray space-x-6 py-2 manrope-400">
          <button className={currentTab === "Problems" ? "text-black font-semibold" : ""} href="/problems" onClick={() => {changeTab("Problems")
            navigate('/problems')
          }}>Problems</button>
          <button className={currentTab === "Discuss" ? "text-black font-semibold" : ""} href="/discuss" onClick={() => {changeTab("Discuss")
            navigate('/discuss')
          }}>Discuss</button>
          <button className={currentTab === "Leaderboard" ? "text-black font-semibold" : ""} href="/leaderboard" onClick={() => {changeTab("Leaderboard")
            navigate('/leaderboard')
          }}>Leaderboard</button>
          </div>
          </div>
          {isLoading ? (<></>) : (
            <div className='flex justify-center items-center space-x-4 manrope-400'>
            {isAuthenticated ? (<><section className='text-bright-orange dm-serif-text-regular text-xl'>{aura} AURA</section>
            <DropdownMenu.Root>
            <DropdownMenu.Trigger><img src={typeof user.picture=== "undefined" ? profile : user.picture} className='h-6 rounded-xl shadow'></img></DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className='z-10 bg-white  text-md mx-3 border-black border-1 rounded-lg drop-shadow m-4 p-2 text-gray' s>
              <DropdownMenu.Separator />
                <DropdownMenu.Item className='outline-none hover:text-black'><a href="/profile" className='px-4 py-2'>Profile</a></DropdownMenu.Item>
                <DropdownMenu.Item className='outline-none hover:text-black'><a href="/submissions" className='px-4 py-2'>Submissions</a></DropdownMenu.Item>
                <DropdownMenu.Item className='outline-none hover:text-black'><button className='px-4' onClick={() => logout({ logoutParams: { returnTo: `https://es-code-client.vercel.app/` } }).then(() => localStorage.removeItem('username'))}>Log Out</button></DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root></>) : (<button className="bg-platinum-50 hover:bg-platinum-100 px-[12px] py-[4px] rounded-lg" onClick={() => loginWithRedirect().then(()=>localStorage.setItem('username', user.nickname))}>Log In</button>)}
          </div>
          )}
          
      </nav>
    )
};

export default NavBar;