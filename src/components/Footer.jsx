import React, { Component } from "react";
import { Fade } from "react-awesome-reveal";
import SocialLinks from "./SocialLinks";
import { Box, Container, HStack, Text, Link, IconButton } from "@chakra-ui/react";
import { ChevronUpIcon } from '@chakra-ui/icons';

class Footer extends Component {
  render() {
    if (!this.props.data) return null;

    const social = this.props.data.social || {};
    const website = social.website;
    const year = new Date().getFullYear();

    return (
      <Box as="footer" textAlign="center" color="#303030" py={12} position="relative">
        <Fade direction="up" duration={1000}>
          <Container>
            <SocialLinks social={social} />
            <HStack as="ul" spacing={2} justify="center" listStyleType="none" mt={4} color="#525252">
              <Text as="li">&copy; Copyright {year} <Link href={website} isExternal title="Goh Jia Yi, Jesa">Goh Jia Yi, Jesa</Link></Text>
            </HStack>
          </Container>
        </Fade>

        <Box position="absolute" top={-6} left="50%" transform="translateX(-50%)">
          <Link href="#home" aria-label="Back to Top">
            <IconButton aria-label="Back to top" bg="#525252" color="white" _hover={{ bg: 'brand.500' }} icon={<ChevronUpIcon />} />
          </Link>
        </Box>
      </Box>
    );
  }
}

export default Footer;
