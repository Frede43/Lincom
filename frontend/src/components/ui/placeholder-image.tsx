import React from 'react'

interface PlaceholderImageProps {
  width?: number
  height?: number
  text?: string
  backgroundColor?: string
  textColor?: string
  className?: string
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width = 150,
  height = 80,
  text = 'IMG',
  backgroundColor = '#6B7280',
  textColor = '#FFFFFF',
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`inline-block ${className}`}
      role="img"
      aria-label={`Placeholder image: ${text}`}
    >
      <rect
        width="100%"
        height="100%"
        fill={backgroundColor}
        rx="4"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={Math.min(width / text.length * 1.2, height * 0.3)}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="600"
      >
        {text}
      </text>
    </svg>
  )
}

// Composants spécialisés pour les partenaires
export const PartnerLogo: React.FC<{
  name: string
  color?: string
  className?: string
}> = ({ name, color = '#6B7280', className = '' }) => {
  return (
    <PlaceholderImage
      width={150}
      height={80}
      text={name}
      backgroundColor={color}
      textColor="#FFFFFF"
      className={className}
    />
  )
}

// Composant pour les avatars
export const AvatarPlaceholder: React.FC<{
  name: string
  size?: number
  className?: string
}> = ({ name, size = 40, className = '' }) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308',
    '#84CC16', '#22C55E', '#10B981', '#14B8A6',
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'
  ]

  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const backgroundColor = colors[colorIndex % colors.length]

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gray-500 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor,
        fontSize: size * 0.4,
        fontWeight: 600,
        color: '#FFFFFF'
      }}
    >
      {initials}
    </div>
  )
}

// Composant pour les images de cours
export const CourseImagePlaceholder: React.FC<{
  title: string
  category?: string
  className?: string
}> = ({ title, category = 'Course', className = '' }) => {
  const categoryColors = {
    'Python': '#3776AB',
    'JavaScript': '#F7DF1E',
    'React': '#61DAFB',
    'Design': '#FF6B6B',
    'Business': '#4ECDC4',
    'AI': '#FF9F43',
    'Data': '#6C5CE7',
    'Mobile': '#00D2D3',
    'Web': '#FD79A8',
    'Course': '#6B7280'
  }

  const color = categoryColors[category as keyof typeof categoryColors] || categoryColors.Course

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ backgroundColor: color, aspectRatio: '16/9' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
        <div className="text-2xl font-bold mb-2">📚</div>
        <div className="text-sm font-semibold text-center line-clamp-2">
          {title}
        </div>
        <div className="text-xs opacity-75 mt-1">
          {category}
        </div>
      </div>
    </div>
  )
}

// Composant pour les images de projet
export const ProjectImagePlaceholder: React.FC<{
  title: string
  type?: string
  className?: string
}> = ({ title, type = 'Project', className = '' }) => {
  const typeColors = {
    'startup': '#FF6B6B',
    'student': '#4ECDC4',
    'research': '#45B7D1',
    'social': '#96CEB4',
    'Project': '#6B7280'
  }

  const typeIcons = {
    'startup': '🚀',
    'student': '🎓',
    'research': '🔬',
    'social': '🤝',
    'Project': '💡'
  }

  const color = typeColors[type as keyof typeof typeColors] || typeColors.Project
  const icon = typeIcons[type as keyof typeof typeIcons] || typeIcons.Project

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ backgroundColor: color, aspectRatio: '16/9' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
        <div className="text-2xl font-bold mb-2">{icon}</div>
        <div className="text-sm font-semibold text-center line-clamp-2">
          {title}
        </div>
        <div className="text-xs opacity-75 mt-1 capitalize">
          {type}
        </div>
      </div>
    </div>
  )
}

export default PlaceholderImage
