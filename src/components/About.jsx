import React, { Component } from "react";
import { Fade } from "react-awesome-reveal";
import { Container, Heading, Text, Stack, Image, Button, Box, Link } from "@chakra-ui/react";
import { DownloadIcon } from '@chakra-ui/icons';

class About extends Component {
  render() {
    if (!this.props.data) return null;

    const profilepic = "images/" + this.props.data.image;
    const bio = this.props.data.bio || [];
    const resumeDownload = "files/" + this.props.data.resumedownload;

    return (
      <Box
        as="section"
        id="about"
        bgGradient="linear(to-b, #424147, #3a3940)"
        pt={{ base: 16, md: 20 }}
        pb={{ base: 10, md: 12 }}
        scrollMarginTop="80px"
      >
        <Fade duration={1000}>
          <Container maxW="5xl">
            <Stack direction={{ base: 'column', md: 'row' }} spacing={10} align="flex-start">
              <Image
                src={profilepic}
                alt="Goh Jia Yi, Jesa Profile Pic"
                boxSize="150px"
                borderRadius="full"
                objectFit="cover"
                _hover={{ transform: 'scale(1.05)' }}
                transition="transform 0.3s ease"
              />
              <Box flex="1">
                <Heading as="h2" size="md" color="brand.200" mb={4} borderBottom="3px solid" borderColor="brand.500" display="inline-block" pb={1}>
                  About
                </Heading>
                {bio.map((sentence, idx) => (
                  <Text key={idx} color="white" lineHeight="30px" mb={4}>
                    {sentence}
                  </Text>
                ))}
                <Button as={Link} href={resumeDownload} isExternal leftIcon={<DownloadIcon />} mt={2} bg="#1f1f1f" color="brand.200" _hover={{ bg: 'brand.200', color: '#1f1f1f' }}>
                  Download Resume
                </Button>
              </Box>
            </Stack>
          </Container>
        </Fade>
      </Box>
    );
  }
}

export default About;
