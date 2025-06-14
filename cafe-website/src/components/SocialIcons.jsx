// components/SocialIcons.jsx
import React from 'react';
import { 
  HStack, IconButton, Tooltip, 
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiInstagram, FiFacebook, FiTwitter,
  FiYoutube, FiLinkedin
} from 'react-icons/fi';

const SocialIcons = () => {
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  const hoverColor = useColorModeValue('brand.500', 'brand.200');

  const socialLinks = [
    { 
      icon: <FiInstagram />, 
      label: 'Instagram',
      url: 'https://instagram.com'
    },
    { 
      icon: <FiFacebook />, 
      label: 'Facebook',
      url: 'https://facebook.com'
    },
    { 
      icon: <FiTwitter />, 
      label: 'Twitter',
      url: 'https://twitter.com'
    },
    { 
      icon: <FiYoutube />, 
      label: 'YouTube',
      url: 'https://youtube.com'
    },
    { 
      icon: <FiLinkedin />, 
      label: 'LinkedIn',
      url: 'https://linkedin.com'
    }
  ];

  return (
    <HStack spacing={4}>
      {socialLinks.map((social) => (
        <Tooltip key={social.label} label={social.label}>
          <IconButton
            as="a"
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            icon={social.icon}
            variant="ghost"
            color={iconColor}
            _hover={{ color: hoverColor, transform: 'scale(1.1)' }}
            transition="all 0.2s"
            fontSize="xl"
          />
        </Tooltip>
      ))}
    </HStack>
  );
};

export default SocialIcons;