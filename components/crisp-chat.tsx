'use client'

import { useEffect } from 'react'
import { Crisp } from 'crisp-sdk-web'

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('f358d750-4efc-410c-ac35-a88e7e3eb826')
  }, [])

  return null
}