        {activeTab === 'informacion' && (
          <div>
            <h3 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600' }}>
              Información General
            </h3>
            
            {/* Basic Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                  Código
                </label>
                <input
                  type="text"
                  value={perrito.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={perrito.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                  Raza
                </label>
                <input
                  type="text"
                  value={perrito.raza}
                  onChange={(e) => handleInputChange('raza', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                  Edad
                </label>
                <input
                  type="text"
                  value={perrito.edad}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                  Sexo
                </label>
                <select
                  value={perrito.sexo}
                  onChange={(e) => handleInputChange('sexo', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="macho">Macho</option>
                  <option value="hembra">Hembra</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                  Tamaño
                </label>
                <select
                  value={perrito.tamano}
                  onChange={(e) => handleInputChange('tamano', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="chico">Chico</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={perrito.peso || ''}
                  onChange={(e) => handleInputChange('peso', e.target.value ? parseFloat(e.target.value) : null)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                  Estado
                </label>
                <select
                  value={perrito.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="disponible">Disponible para Adopción</option>
                  <option value="proceso">En Proceso de Adopción</option>
                  <option value="adoptado">Adoptado</option>
                  <option value="tratamiento">En Tratamiento/Recuperación</option>
                </select>
              </div>
            </div>

            {/* Visibility Controls */}
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>
                Visibilidad en Catálogo
              </h4>
              
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.estado === 'disponible'}
                    onChange={(e) => handleInputChange('estado', e.target.checked ? 'disponible' : 'tratamiento')}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <Eye style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                  Visible como "Disponible para Adopción"
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.destacado}
                    onChange={(e) => handleInputChange('destacado', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <Heart style={{ width: '16px', height: '16px', color: '#af1731' }} />
                  Destacar en página principal
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.estado === 'tratamiento'}
                    onChange={(e) => handleInputChange('estado', e.target.checked ? 'tratamiento' : 'disponible')}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <EyeOff style={{ width: '16px', height: '16px', color: '#dc2626' }} />
                  Mostrar como "En Recuperación"
                </label>
              </div>
            </div>

            {/* Health Status */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>
                Estado de Salud
              </h4>
              
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.vacunas}
                    onChange={(e) => handleInputChange('vacunas', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Vacunas completas
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.esterilizado}
                    onChange={(e) => handleInputChange('esterilizado', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Esterilizado/Castrado
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.desparasitado}
                    onChange={(e) => handleInputChange('desparasitado', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Desparasitado
                </label>
              </div>
            </div>

            {/* Temperament */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>
                Temperamento y Compatibilidad
              </h4>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                    Nivel de Energía
                  </label>
                  <select
                    value={perrito.energia}
                    onChange={(e) => handleInputChange('energia', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.aptoNinos}
                    onChange={(e) => handleInputChange('aptoNinos', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Apto para niños
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.aptoPerros}
                    onChange={(e) => handleInputChange('aptoPerros', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Apto para otros perros
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={perrito.aptoGatos}
                    onChange={(e) => handleInputChange('aptoGatos', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Apto para gatos
                </label>
              </div>
            </div>

            {/* Historia */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                Historia
              </label>
              <textarea
                value={perrito.historia}
                onChange={(e) => handleInputChange('historia', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
                placeholder="Cuenta la historia de esta mascota..."
              />
            </div>
          </div>
        )}

        {activeTab === 'medico' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                Historial Médico
              </h3>
              <button
                onClick={() => setShowMedicalModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#af1731',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Agregar Registro
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {expedienteMedico.map((record) => (
                <div key={record.id} style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#af1731',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {record.tipo}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {new Date(record.fecha).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteExpediente(record.id)}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                  
                  <p style={{ margin: '8px 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {record.descripcion}
                  </p>
                  
                  {record.veterinario && (
                    <p style={{ margin: '4px 0', fontSize: '0.75rem', color: '#64748b' }}>
                      Veterinario: {record.veterinario}
                    </p>
                  )}
                  
                  {record.medicamento && (
                    <p style={{ margin: '4px 0', fontSize: '0.75rem', color: '#64748b' }}>
                      Medicamento: {record.medicamento} - {record.dosis}
                    </p>
                  )}
                  
                  {record.costo && (
                    <p style={{ margin: '4px 0', fontSize: '0.75rem', color: '#16a34a', fontWeight: '500' }}>
                      Costo: ${record.costo}
                    </p>
                  )}
                </div>
              ))}
              
              {expedienteMedico.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  <Stethoscope style={{ width: '32px', height: '32px', margin: '0 auto 8px' }} />
                  <p>No hay registros médicos. Agrega el primer registro.</p>
                </div>
              )}
            </div>
          </div>
        )}