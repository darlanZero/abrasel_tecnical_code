import React from 'react'

const landing = () => {
  return (
    <div className='space-y-20'>
        {/* Hero Section */}
        <section className='pt-20 pb-32'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center'>
                    <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-8'>
                        Conectando o setor de 
                        <span className='text-indigo-600 block'>alimentação fora do lar</span>
                    </h1>

                    <p className='text-xl text-gray-600 mb-12 max-w-3xl mx-auto'>
                        A Abrasel é a principal associação que representa e fortalece bares, restaurantes e estabelecimentos de alimentação no Brasil, promovendo o desenvolvimento do setor.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <a href="#sobre"
                        className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors'
                        >
                            Saiba mais sobre a Abrasel
                        </a>

                        <a 
                        href="/login"
                        className='bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-8 py-4 rounded-lg text-lg font-medium transition-colors'
                        >
                            Área do Associado
                        </a>
                    </div>
                </div>
            </div>
        </section>

        {/* About Section */}
      <section id="sobre" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sobre a Abrasel
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Há mais de duas décadas defendendo os interesses do setor de alimentação fora do lar
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Nossa Missão
              </h3>
              <p className="text-gray-600 mb-6">
                Representar, defender e promover os interesses dos estabelecimentos 
                de alimentação fora do lar, contribuindo para o desenvolvimento 
                sustentável do setor através de ações políticas, econômicas e sociais.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Defesa dos direitos dos associados
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Capacitação e desenvolvimento profissional
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Representação política e institucional
                </li>
              </ul>
            </div>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500">Imagem institucional</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos suporte completo para o crescimento do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <span className="text-blue-600 text-xl font-bold">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Consultoria Especializada
              </h3>
              <p className="text-gray-600">
                Orientação técnica e jurídica especializada para o setor de alimentação.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <span className="text-blue-600 text-xl font-bold">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Capacitação
              </h3>
              <p className="text-gray-600">
                Cursos, workshops e treinamentos para profissionalização do setor.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <span className="text-blue-600 text-xl font-bold">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Representação
              </h3>
              <p className="text-gray-600">
                Defesa dos interesses do setor junto aos órgãos públicos e privados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default landing