import React from "react";
import { Fade } from "react-awesome-reveal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faMedium } from "@fortawesome/free-brands-svg-icons";
import { Box, Container, Heading, SimpleGrid, Image, Badge, HStack, Tag, Link, Text, Flex, Icon, AspectRatio, Wrap, WrapItem } from "@chakra-ui/react";
import { ExternalLinkIcon, LinkIcon, AttachmentIcon, ViewIcon } from '@chakra-ui/icons';

/*
  Showcase component: Reimagined gallery to highlight tech projects and talks.
  Expects data of the form:
  {
    items: [
      {
        title: string,
        summary: string, // one-liner
        image?: string,  // e.g. "images/gallery/shopee.jpg" or "gallery/shopee.jpg"
        type?: "project" | "talk", // used for filtering (optional)
        links?: [ { label: string, url: string } ]
      }
    ]
  }
*/

const Showcase = ({ data }) => {
  if (!data) return null;

  const items = Array.isArray(data.items) ? data.items : [];

  const resolveImageSrc = (img) => {
    if (!img) return null;
    // Allow both "images/..." and relative paths like "gallery/foo.jpg"
    if (img.startsWith("images/")) return img;
    return `images/${img}`;
  };

  // Category badges (Project / Tech Talk / Hackathon)
  const getCategoryBadges = (item) => {
    const norm = (s) => String(s || '').trim().toLowerCase();
    let types = [];
    if (Array.isArray(item.types)) {
      types = item.types.map(norm).filter(Boolean);
    } else if (Array.isArray(item.type)) {
      types = item.type.map(norm).filter(Boolean);
    } else if (typeof item.type === 'string') {
      const raw = norm(item.type);
      types = raw.split(',').map((x) => x.trim()).filter(Boolean);
    }

    if (!types.length) return [];

    const toBadge = (t) => {
      let label = 'Project';
      let bg = 'green.500';
      if (t === 'talk' || t === 'tech talk') {
        label = 'Tech Talk';
        bg = 'yellow.400';
      } else if (t === 'project') {
        label = 'Project';
        bg = 'green.500';
      } else if (t === 'hackathon') {
        label = 'Hackathon';
        bg = 'orange.400';
      } else {
        label = t.charAt(0).toUpperCase() + t.slice(1);
        bg = 'green.500';
      }
      return { label, bg };
    };

    return types.map(toBadge);
  };

  return (
    <Box as="section" id="projects" pt={{ base: 12, md: 16 }} pb={{ base: 8, md: 10 }} bg="#ffffff" color="#111" scrollMarginTop="80px">
      <Fade direction="left" duration={1000} distance="24px">
        <Container maxW="6xl">
          <Heading as="h1" size="md" mb={6} borderBottom="3px solid" borderColor="brand.500" display="inline-block" pb={1} color="black">Featured Work</Heading>
          {(() => {
            const smCols = Math.min(2, items.length || 0);
            const lgCols = items.length === 4 ? 2 : 3;
            return (
              <SimpleGrid columns={{ base: 1, sm: smCols, lg: lgCols }} spacing={3}>
                {items.map((it, idx) => {
                  const src = resolveImageSrc(it.image);
                  const type = typeof it.type === 'string' ? it.type.toLowerCase() : '';
                  const badgeLabel =
                    type === "talk" || type === "tech talk"
                      ? "Tech Talk"
                      : type === "project"
                      ? "Project"
                      : type === 'hackathon'
                      ? 'Hackathon'
                      : null;
                  const tags = Array.isArray(it.tags) ? it.tags.filter(Boolean) : [];
                  return (
                    <Box key={`${it.title}-${idx}`} layerStyle="card" overflow="hidden" position="relative">
                  {(() => {
                    const catBadges = getCategoryBadges(it);
                    if (!catBadges.length && (type === 'talk' || type === 'tech talk' || type === 'project' || type === 'hackathon')) {
                      // Back-compat for existing single type
                      let bg = 'green.500';
                      if (type === 'talk' || type === 'tech talk') bg = 'yellow.400';
                      else if (type === 'hackathon') bg = 'orange.400';
                      return (
                        <Badge position="absolute" top={2} left={2} zIndex={2} pointerEvents="none" bg={bg} color="white">{badgeLabel}</Badge>
                      );
                    }
                    if (!catBadges.length) return null;
                    return (
                      <HStack position="absolute" top={2} left={2} zIndex={2} spacing={2} pointerEvents="none">
                        {catBadges.map((b, i) => (
                          <Badge key={`${it.title}-cat-${i}`} bg={b.bg} color="white">{b.label}</Badge>
                        ))}
                      </HStack>
                    );
                  })()}
                      {src ? (
                        <AspectRatio ratio={16 / 9}>
                          <Image src={src} alt={it.title} w="100%" objectFit="cover" />
                        </AspectRatio>
                      ) : (
                        <Flex w="100%" align="center" justify="center" bg="gray.100" color="gray.500" minH="180px">No image available</Flex>
                      )}
                      <Box p={3}>
                        <Box mb={2}>
                          <Heading as="h3" size="sm" color="gray.800">{it.title}</Heading>
                          {it.date && (
                            <Text fontSize="xs" color="gray.500" mt={1}>{it.date}</Text>
                          )}
                        </Box>
                        {tags.length > 0 && (
                          <Wrap spacing={2} mb={2}>
                        {tags.map((tag, tIdx) => (
                          <WrapItem key={`${it.title}-tag-${tIdx}`}>
                            <Tag size="sm" colorScheme="gray" variant="subtle">{tag}</Tag>
                          </WrapItem>
                        ))}
                          </Wrap>
                        )}
                        {it.summary && (
                          <Text color="gray.600" fontSize="xs" mb={2}>{it.summary}</Text>
                        )}
                        {Array.isArray(it.links) && it.links.length > 0 && (
                          <HStack spacing={2} flexWrap="wrap">
                            {it.links.map((lnk, i) => {
                              const raw = lnk.label || "";
                              const label = raw.toLowerCase();
                              const url = lnk.url || "";
                              const title = raw || "Link";

                              const isGithub = label.includes("github") || url.includes("github.com");
                              const isMedium = label.includes("medium") || url.includes("medium.com");
                              const isSlides = label.includes("slide");
                              const isVideo = label.includes("video");
                              const isCode = label.includes("code") || label.includes("repo") || label.includes("source");
                              const isDemo = label.includes("demo") || label.includes("live") || url.includes("vercel.app") || url.includes("netlify.app") || url.includes("github.io");

                              let iconEl = <LinkIcon boxSize={4} />;
                              if (isGithub) iconEl = <Icon as={FontAwesomeIcon} icon={faGithub} />;
                              else if (isMedium) iconEl = <Icon as={FontAwesomeIcon} icon={faMedium} />;
                              else if (isSlides) iconEl = <AttachmentIcon boxSize={4} />;
                              else if (isVideo) iconEl = <ViewIcon boxSize={4} />;
                              else if (isCode) iconEl = <Icon as={FontAwesomeIcon} icon={["fas", "code"]} />;
                              else if (isDemo) iconEl = <ExternalLinkIcon boxSize={4} />;

                              return (
                                <Link
                                  key={`${label}-${i}`}
                                  href={url}
                                  isExternal
                                  aria-label={title}
                                  role="group"
                                  display="inline-flex"
                                  alignItems="center"
                                  gap={2}
                                  color="gray.700"
                                  _hover={{ color: 'brand.500' }}
                                >
                              <Box
                                w="28px"
                                h="28px"
                                borderRadius="full"
                                bg="#111"
                                color="#fff"
                                    display="inline-flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    transition="all 200ms ease"
                                    _groupHover={{ bg: 'brand.500', transform: 'translateY(-2px)', color: 'white' }}
                                  >
                                    {iconEl}
                                  </Box>
                                  <Text fontSize="xs" transition="color 200ms ease" _groupHover={{ color: 'brand.500' }}>{title}</Text>
                                </Link>
                              );
                            })}
                          </HStack>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </SimpleGrid>
            );
          })()}
        </Container>
      </Fade>
    </Box>
  );
};

export default Showcase;
