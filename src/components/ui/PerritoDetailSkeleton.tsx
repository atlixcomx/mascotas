'use client'

export default function PerritoDetailSkeleton() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Breadcrumb Skeleton */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px' }}>
          <div style={{ 
            height: '20px', 
            backgroundColor: '#e2e8f0', 
            borderRadius: '4px', 
            width: '200px',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          
          {/* Image Skeleton */}
          <div>
            <div style={{
              height: '384px',
              backgroundColor: '#e2e8f0',
              borderRadius: '8px',
              marginBottom: '16px',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            
            {/* Thumbnails Skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '80px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '6px',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '24px',
              marginBottom: '24px'
            }}>
              {/* Title */}
              <div style={{
                height: '36px',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                width: '60%',
                marginBottom: '12px',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              
              {/* Subtitle */}
              <div style={{
                height: '24px',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                width: '40%',
                marginBottom: '24px',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              
              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '50%',
                      animation: 'pulse 2s ease-in-out infinite'
                    }} />
                    <div>
                      <div style={{
                        height: '16px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '4px',
                        width: '60px',
                        marginBottom: '4px',
                        animation: 'pulse 2s ease-in-out infinite'
                      }} />
                      <div style={{
                        height: '20px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '4px',
                        width: '80px',
                        animation: 'pulse 2s ease-in-out infinite'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Info Skeleton */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '24px'
            }}>
              <div style={{
                height: '24px',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                width: '50%',
                marginBottom: '16px',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{
                    height: '60px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '8px',
                    animation: 'pulse 2s ease-in-out infinite'
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Story Section Skeleton */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginTop: '48px'
        }}>
          <div style={{
            height: '32px',
            backgroundColor: '#e2e8f0',
            borderRadius: '4px',
            width: '40%',
            marginBottom: '16px',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                height: '16px',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                width: i === 3 ? '60%' : '100%',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}