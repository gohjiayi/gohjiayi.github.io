import React, { Component } from "react";
import { Slide } from "react-awesome-reveal";
import { Box, Container, Heading, Text, VStack, HStack, Divider, List, ListItem, Icon, SimpleGrid, Tag, Wrap, WrapItem } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Resume extends Component {
  render() {
    if (!this.props.data) return null;

    const education = (this.props.data.education || []).map((education) => (
      <Box key={education.school} mb={10}>
        <Heading as="h4" size="md" fontWeight="semibold" color="gray.900">{education.school}</Heading>
        <Text color="brand.600" fontSize="sm" mt={1}>
          {education.degree} • {education.graduated}
        </Text>
        {education.description && (
          <Text mt={2} color="gray.600" fontSize="sm" lineHeight="tall">{education.description}</Text>
        )}
        {education.activities && (
          <Box mt={1} pl={4}>
            <Text as="h5" fontSize="xs" fontWeight="medium" color="gray.700" mb={0}>
              Activities and Societies
            </Text>
            <List spacing={0} styleType="disc" stylePosition="outside" pl={4}>
              {(
                Array.isArray(education.activities)
                  ? education.activities
                  : String(education.activities).split(/;\s*/)
              ).map((activity, idx) => (
                <ListItem key={idx}>
                  <Text as="span" color="gray.600" fontSize="xs" lineHeight={1.1}>{activity}</Text>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    ));

    const workArray = (this.props.data.work || []);
    const work = workArray.map((work, idx) => (
      <HStack key={`${work.company}-${idx}`} align="flex-start" spacing={4} mb={12}>
        <Box w="24px" minW="24px" display="flex" justifyContent="center">
          <Box w="10px" h="10px" borderRadius="full" bg="brand.500" mt="6px"
               position="relative" zIndex={1}
               boxShadow="0 0 0 4px rgba(192,37,89,0.15), 0 0 14px rgba(192,37,89,0.35)" />
        </Box>
        <Box>
          <Heading as="h4" size="md" fontWeight="semibold" color="gray.900">
            {work.title}
          </Heading>
          <Text color="brand.600" fontSize="sm" mt={1}>
            {work.company} • {work.location} • {work.years}
          </Text>
          <List spacing={2} styleType="disc" stylePosition="outside" pl={5} mt={2}>
            {(work.description || []).map((sentence, i) => (
              <ListItem key={i}>
                <Text color="gray.600" fontSize="sm" lineHeight="tall" display="inline">{sentence}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      </HStack>
    ));

    // Removed vertical timeline per request; standardized typography between sections

    const technicalTags = (this.props.data.technicalskills || []).map((skill) => (
      <WrapItem key={skill.skill}>
        <Tag
          size="lg"
          px={3}
          py={2}
          borderRadius="full"
          bg="pink.50"
          color="brand.700"
          border="1px solid"
          borderColor="pink.100"
        >
          <Icon as={FontAwesomeIcon} icon={["fas", skill.icon]} mr={2} />
          <Text as="span" fontSize="sm" fontWeight="medium">{skill.skill}</Text>
        </Tag>
      </WrapItem>
    ));

    const softTags = (this.props.data.softskills || []).map((skill) => (
      <WrapItem key={skill.skill}>
        <Tag
          size="lg"
          px={3}
          py={2}
          borderRadius="full"
          bg="pink.50"
          color="brand.700"
          border="1px solid"
          borderColor="pink.100"
        >
          <Icon as={FontAwesomeIcon} icon={["fas", skill.icon]} mr={2} />
          <Text as="span" fontSize="sm" fontWeight="medium">{skill.skill}</Text>
        </Tag>
      </WrapItem>
    ));

    return (
      <Box
        as="section"
        id="resume"
        bg="gray.50"
        color="gray.800"
        pt={{ base: 16, md: 20 }}
        pb={{ base: 10, md: 12 }}
        scrollMarginTop="80px"
      >
        <Container maxW="5xl">
          <Slide direction="left" duration={1000}>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} mb={10}>
              <Box gridColumn={{ md: 'span 1' }}>
                <Heading as="h1" size="md" color="black">
                  <Box as="span" borderBottom="3px solid" borderColor="brand.500" pb={1}>Experience</Box>
                </Heading>
              </Box>
              <Box gridColumn={{ md: 'span 3' }}>
                {work}
              </Box>
            </SimpleGrid>
          </Slide>

          <Divider my={6} />

          <Slide direction="left" duration={1000}>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} mb={10}>
              <Box>
                <Heading as="h1" size="md" color="black">
                  <Box as="span" borderBottom="3px solid" borderColor="brand.500" pb={1}>Education</Box>
                </Heading>
              </Box>
              <Box gridColumn={{ md: 'span 3' }}>{education}</Box>
            </SimpleGrid>
          </Slide>

          <Divider my={6} />

          <Slide direction="left" duration={1000}>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
              <Box>
                <Heading as="h1" size="md" color="black">
                  <Box as="span" borderBottom="3px solid" borderColor="brand.500" pb={1}>Skills</Box>
                </Heading>
              </Box>
              <Box gridColumn={{ md: 'span 3' }}>
                <VStack align="stretch" spacing={6}>
                  <Box>
                    <Heading as="h4" size="md" mb={2}>Technical Skills</Heading>
                    <Wrap spacing={2} shouldWrapChildren>{technicalTags}</Wrap>
                  </Box>
                  <Box>
                    <Heading as="h4" size="md" mb={2}>Soft Skills</Heading>
                    <Wrap spacing={2} shouldWrapChildren>{softTags}</Wrap>
                  </Box>
                </VStack>
              </Box>
            </SimpleGrid>
          </Slide>
        </Container>
      </Box>
    );
  }
}

export default Resume;
