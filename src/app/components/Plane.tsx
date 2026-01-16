'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';

const Plane = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1.3;

    const scene = new THREE.Scene();
    let plane: any;
    let mixer: any;
    let hasFlownOut = false;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 4));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(500, 500, 500);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('/plane.glb', (gltf: any) => {
      plane = gltf.scene;
      
      // Set initial position off-screen to the right
      plane.position.set(0.5, 0.5, 0);
      plane.rotation.set(0.3, -0.8, 0);
      
      scene.add(plane);
      mixer = new THREE.AnimationMixer(plane);
      if (gltf.animations[0]) mixer.clipAction(gltf.animations[0]).play();
      
      // Animate plane flying in from the right to hero position
      gsap.to(plane.position, { 
        x: 0.075, 
        y: 0, 
        z: 0, 
        duration: 3, 
        ease: 'power2.out',
        delay: 0.3
      });
      gsap.to(plane.rotation, { 
        x: 0.3, 
        y: -0.5, 
        z: 0, 
        duration: 2.5, 
        ease: 'power2.out',
        delay: 0.3
      });
    });

    const positions = [
      { id: 'hero', position: { x: 0.075, y: 0, z: 0 }, rotation: { x: 0.3, y: -0.5, z: 0 } },
      { id: 'clouds', position: { x: -0.2, y: 0, z: -1 }, rotation: { x: 0.5, y: 0.5, z: 0 } },
      { id: 'about', position: { x: -0.2, y: 0, z: -1 }, rotation: { x: 0.5, y: 0.5, z: 0 } }
    ];

    const animate = () => {
      requestAnimationFrame(animate);
      if (mixer) mixer.update(0.01);
      renderer.render(scene, camera);
    };
    animate();

    const handleScroll = () => {
      if (!plane) return;
      
      const aboutSection = document.getElementById('about');
      if (!aboutSection) return;
      
      const aboutRect = aboutSection.getBoundingClientRect();
      
      // Check if we've scrolled past the about section
      if (aboutRect.bottom < 50) {
        if (!hasFlownOut) {
          hasFlownOut = true;
          // Fly out of screen (move far to the right and down)
          gsap.to(plane.position, { 
            x: 3, 
            y: -2, 
            z: 0, 
            duration: 1.5, 
            ease: 'power2.in',
            overwrite: true
          });
          gsap.to(plane.rotation, { 
            x: 0.5, 
            y: 1, 
            z: 0.3, 
            duration: 1.5, 
            ease: 'power2.in',
            overwrite: true
          });
        }
        return;
      }
      
      if (hasFlownOut && aboutRect.bottom >= 50) {
        hasFlownOut = false;
      }
      
      let currentSection = '';
      const sections = document.querySelectorAll('.section');
      
      // Find the section that takes up the most viewport space
      let maxVisibleArea = 0;
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        
        // Only consider sections up to and including 'about'
        if (section.id === 'hero' || section.id === 'clouds' || section.id === 'about') {
          // Calculate how much of the section is visible
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(window.innerHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          
          if (visibleHeight > maxVisibleArea) {
            maxVisibleArea = visibleHeight;
            currentSection = section.id;
          }
        }
      });

      const coords = positions.find(p => p.id === currentSection);
      if (coords) {
        gsap.to(plane.position, { 
          ...coords.position, 
          duration: 3, 
          ease: 'power1.out',
          overwrite: true
        });
        gsap.to(plane.rotation, { 
          ...coords.rotation, 
          duration: 3, 
          ease: 'power1.out',
          overwrite: true
        });
      }
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll(); // Initialize position on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50" />;
};

export default Plane;