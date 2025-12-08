import React from "react";
import { HStack, IconButton, Link, Icon } from "@chakra-ui/react";
import { EmailIcon } from '@chakra-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faMedium, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const SocialLinks = ({ social, spacing = 4 }) => {
  if (!social) return null;

  const linkedin = social.linkedin;
  const github = social.github;
  const x = social.x;
  const medium = social.medium;
  const googlescholar = social.googlescholar;
  const email = social.email ? "mailto:" + social.email : null;

  const items = [
    { key: 'linkedin', href: linkedin, icon: faLinkedin, label: 'LinkedIn', type: 'fa' },
    { key: 'github', href: github, icon: faGithub, label: 'GitHub', type: 'fa' },
    { key: 'x', href: x, icon: faXTwitter, label: 'X', type: 'fa' },
    { key: 'medium', href: medium, icon: faMedium, label: 'Medium', type: 'fa' },
    { key: 'googlescholar', href: googlescholar, icon: faGraduationCap, label: 'Google Scholar', type: 'fa' },
    { key: 'email', href: email, label: 'Email', type: 'chakra' },
  ].filter(i => !!i.href);

  const iconBtnSize = { base: 'sm', sm: 'md', md: 'lg' };
  const iconBoxSize = { base: 5, sm: 6, md: 7 }; // compact on mobile, bigger on desktop

  return (
    <HStack
      spacing={{ base: 2, sm: 3, md: spacing }}
      justify="center"
      flexWrap={{ base: 'wrap', md: 'nowrap' }}
      rowGap={{ base: 2, md: 0 }}
    >
      {items.map(({ key, href, icon, label, type }) => (
        <Link key={key} href={href} isExternal aria-label={label} _hover={{ color: 'brand.300' }}>
          <IconButton
            variant="ghost"
            size={iconBtnSize}
            color="whiteAlpha.900"
            _hover={{ bg: 'whiteAlpha.200', color: 'brand.200', transform: 'translateY(-2px)' }}
            transition="all 200ms ease"
            icon={
              type === 'chakra'
                ? <EmailIcon boxSize={iconBoxSize} />
                : <Icon as={FontAwesomeIcon} icon={icon} boxSize={iconBoxSize} />
            }
          />
        </Link>
      ))}
    </HStack>
  );
};

export default SocialLinks;
