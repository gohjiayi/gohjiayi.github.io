import React, { Component } from "react";
import { Fade } from "react-awesome-reveal";
import { Box, Flex, HStack, Link, Heading, Text, Container, IconButton, VStack } from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { keyframes } from '@emotion/react';
import SocialLinks from "./SocialLinks";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { mobileOpen: false };
    this.toggleMobile = this.toggleMobile.bind(this);
    this.closeMobile = this.closeMobile.bind(this);
  }

  toggleMobile() {
    this.setState(s => ({ mobileOpen: !s.mobileOpen }));
  }

  closeMobile() {
    this.setState({ mobileOpen: false });
  }

  render() {
    if (!this.props.data) return null;

    const name = this.props.data.name;
    const headline = this.props.data.headline;
    const social = this.props.data.social || {};
    const active = this.props.active || 'home';
    const isOpen = this.state.mobileOpen;

    const glow = keyframes`
      from {
        text-shadow:
          0 0 8px rgba(255,255,255,0.7),
          0 0 16px rgba(255, 77, 166, 0.5),
          0 0 24px rgba(255, 77, 166, 0.35);
      }
      to {
        text-shadow:
          0 0 10px rgba(255,255,255,0.9),
          0 0 28px rgba(255, 77, 166, 0.8),
          0 0 48px rgba(255, 77, 166, 0.6);
      }
    `;

    return (
      <Box
        as="header"
        id="home"
        position="relative"
        minH="100vh"
        overflowX="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          inset: 0,
          bgImage: [
            "radial-gradient(110rem 70rem at 50% -25%, rgba(255, 77, 166, 0.60), transparent 60%)",
            "radial-gradient(70rem 40rem at 55% -10%, rgba(255, 105, 180, 0.45), transparent 55%)",
            "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.50))",
            "url('/images/background.jpg')",
          ].join(', '),
          bgPos: 'center',
          bgSize: 'cover',
          bgRepeat: 'no-repeat',
          filter: 'grayscale(100%)',
          zIndex: -1,
        }}
      >
        {/* Top nav */}
        <Flex
          as="nav"
          position="fixed"
          top={0}
          left={0}
          right={0}
          zIndex={10}
          align="center"
          justify={{ base: 'space-between', md: 'center' }}
          bg="rgba(51,51,51,0.85)"
          px={{ base: 2, md: 0 }}
        >
          <Box display={{ base: 'block', md: 'none' }} px={2} py={2} />
          <HStack as="ul" spacing={6} py={2} px={4} listStyleType="none" display={{ base: 'none', md: 'flex' }}>
            {[
              { href: '#home', id: 'home', label: 'Home' },
              { href: '#about', id: 'about', label: 'About' },
              { href: '#resume', id: 'resume', label: 'Resume' },
              { href: '#projects', id: 'projects', label: 'Projects' },
            ].map(item => (
              <Box as="li" key={item.href}>
                <Link
                  href={item.href}
                  fontSize="xs"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  variant="nav"
                  color={active === item.id ? 'brand.300' : undefined}
                  _after={active === item.id ? { transform: 'scaleX(1)' } : undefined}
                >
                  {item.label}
                </Link>
              </Box>
            ))}
          </HStack>
          <IconButton
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={this.toggleMobile}
            mr={2}
          />
        </Flex>

        {/* Mobile nav panel */}
        {isOpen && (
          <Box position="fixed" top="40px" right={0} left={0} zIndex={9} bg="#1f1f1f" display={{ base: 'block', md: 'none' }}>
            <VStack as="ul" align="stretch" spacing={1} py={2}>
              {[
                { href: '#home', id: 'home', label: 'Home' },
                { href: '#about', id: 'about', label: 'About' },
                { href: '#resume', id: 'resume', label: 'Resume' },
                { href: '#projects', id: 'projects', label: 'Projects' },
              ].map(item => (
                <Box as="li" key={`m-${item.href}`}> 
                  <Link
                    href={item.href}
                    display="block"
                    py={3}
                    px={4}
                    borderRadius="0"
                    bg={active === item.id ? 'whiteAlpha.200' : 'transparent'}
                    color={active === item.id ? 'brand.200' : 'white'}
                    _hover={{ bg: 'whiteAlpha.200', color: 'brand.200' }}
                    onClick={this.closeMobile}
                  >
                    {item.label}
                  </Link>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Centered banner */}
        <Container maxW="5xl" textAlign="center" pt={{ base: 24, md: 28 }}>
          <Box mt={{ base: 32, md: 40 }}>
            <Fade direction="up" duration={1000}>
              <Heading
                as="h1"
                size="3xl"
                lineHeight="1.15"
                pb={1}
                color="white"
                css={{ animation: `${glow} 1500ms ease-in-out infinite alternate` }}
              >
                {name}
              </Heading>
            </Fade>
            {headline && (
              <Fade direction="up" delay={300} duration={1000}>
                <Text mt={3} fontSize={{ base: 'md', md: 'lg' }} color="white">
                  {headline}
                </Text>
              </Fade>
            )}
            <Box as="hr" w={{ base: '70%', md: '60%' }} mx="auto" my={6} borderColor="whiteAlpha.400" />
            <Fade direction="up" duration={1000}>
              <SocialLinks social={social} />
            </Fade>
          </Box>
        </Container>

        {/* Scroll down */}
        <Box position="absolute" bottom={6} left="50%" transform="translateX(-50%)">
          <Link href="#about" aria-label="Scroll to About">
            <IconButton
              aria-label="Scroll"
              variant="ghost"
              color="white"
              _hover={{ color: 'brand.300', bg: 'whiteAlpha.200' }}
              icon={<ChevronDownIcon boxSize={6} />}
            />
          </Link>
        </Box>
      </Box>
    );
  }
}

export default Header;
