'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Sphere } from '@react-three/drei'
import { ClerkProvider, SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Mountain } from 'lucide-react'

function AnimatedSpheres({ mouse }) {
  const spheres = useRef(Array.from({ length: 50 }, (_, i) => ({
    position: [
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
      Math.random() * 20 - 10
    ],
    scale: Math.random() * 0.5 + 0.1
  })))

  useFrame((state) => {
    spheres.current.forEach((sphere, i) => {
      // Further slow down the animation by reducing the increment
      sphere.position[0] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.003
      sphere.position[1] += Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.003
      sphere.position[2] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.003
    })
  })

  return (
    <>
      {spheres.current.map((sphere, index) => (
        <Sphere key={index} args={[sphere.scale, 16, 16]} position={sphere.position}>
          <meshStandardMaterial color={`hsl(${index * 10}, 80%, 70%)`} />
        </Sphere>
      ))}
    </>
  )
}

function Scene({ mouse }) {
  const { camera } = useThree()

  useFrame(() => {
    // Update camera based on mouse or device orientation (values from mouse.current)
    camera.position.x = Math.sin(mouse.current[0]) * 3 // Slower movement
    camera.position.y = Math.sin(mouse.current[1]) * 1.5
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <Environment preset="sunset" />
      <AnimatedSpheres mouse={mouse} />
    </>
  )
}

export default function AdventureRacingClub() {
  const [mounted, setMounted] = useState(false)
  const mouse = useRef([0, 0])

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (event) => {
      mouse.current = [
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      ]
    }

    const handleDeviceOrientation = (event) => {
      const { alpha, beta, gamma } = event
      // Adjust sensitivity of the device orientation input
      mouse.current = [
        gamma / 90, // Gamma controls left-right tilt
        beta / 90   // Beta controls front-back tilt
      ]
    }

    // Desktop mouse events
    window.addEventListener('mousemove', handleMouseMove)
    
    // Mobile device orientation events
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation)
      }
    }
  }, [])

  if (!mounted) return null

  return (
    <ClerkProvider>
      <div className="h-screen w-full overflow-hidden relative bg-gray-100">
        <Canvas className="absolute inset-0">
          <Scene mouse={mouse} />
        </Canvas>
        <div className="absolute inset-0 flex flex-col items-center justify-between p-8">
          <header className="w-full flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-gray-800" />
              <span className="text-gray-800 text-2xl font-bold">ARC</span>
            </div>
          </header>
          <main className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 text-center tracking-tight">
              Adventure Awaits
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 text-center max-w-2xl font-light">
              Join our community of thrill-seekers and push your limits in the great outdoors.
            </p>
            <SignInButton mode="modal">
              <Button className="text-lg font-bold px-8 py-4" size="lg">
                Sign In / Sign Up
              </Button>
            </SignInButton>
          </main>
          <footer className="w-full text-center text-gray-600">
            <p>&copy; 2024 Adventure Racing Club. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </ClerkProvider>
  )
}
