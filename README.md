# Futuristic Participant Randomizer

A stunning web application for participant turn randomization featuring futuristic animations and real-time synchronization between presenter and participant views.

## Features

### 🎭 Presenter Interface
- **CSV Upload**: Import participant lists from CSV files
- **Manual Entry**: Add participants individually or in bulk
- **Real-time Control**: Trigger selection animations visible to all participants
- **Export Functionality**: Download complete participant data with timestamps
- **Reset Options**: Clear all selections and start fresh

### 👥 Participant Interface  
- **Live Synchronization**: Real-time updates from presenter actions
- **Interactive Animation**: Watch the magical selection process
- **Status Tracking**: View selected and unselected participants
- **Timestamp Display**: See exactly when each selection occurred
- **Responsive Design**: Optimized for all screen sizes

### ✨ Futuristic Animations
- **Particle Effects**: Floating particle systems during selection
- **Holographic Cards**: Glass morphism effects with glowing borders
- **Smooth Transitions**: Fluid animations between states
- **Color Palette**: Electric blues, cyber purples, and neon teals
- **Micro-interactions**: Hover effects and selection feedback

### 🚀 Technical Features
- **Vite Framework**: Fast build tool and development server
- **React + TypeScript**: Type-safe component architecture  
- **Framer Motion**: Advanced animation library
- **CSV Processing**: Papa Parse for file import/export
- **Real-time Sync**: localStorage events for cross-tab communication
- **Vercel Ready**: Optimized for seamless deployment

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment to Vercel
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically with zero configuration

## Usage

### For Presenters
1. Navigate to `/presenter`
2. Upload a CSV file or manually add participants
3. Click "Start Selection" to begin the randomization
4. Export results when complete

### For Participants
1. Navigate to `/participant`  
2. Watch the real-time selection animation
3. View selected and unselected participant lists
4. See timestamps for all selections

## File Structure

```
src/
├── components/
│   ├── animations/     # Particle and visual effects
│   ├── home/          # Landing page
│   ├── presenter/     # Presenter interface components
│   ├── participant/   # Participant view components
│   └── shared/        # Reusable UI components
├── contexts/          # React context for state management
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── utils/             # Utility functions (CSV, animations)
```

## CSV Format

Import CSV files with participant names:
```csv
Name
John Doe
Jane Smith
Mike Johnson
Sarah Wilson
```

Export includes additional metadata:
```csv
Name,Selected,Selected At
John Doe,Yes,12/15/2024 2:30:45 PM  
Jane Smith,No,
Mike Johnson,Yes,12/15/2024 2:35:12 PM
```

## Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for any purpose.